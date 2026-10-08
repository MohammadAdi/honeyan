using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using HoneyAn.Application.Common.Exceptions;
using HoneyAn.Application.Identity;
using HoneyAn.Domain.Identity;
using HoneyAn.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.JsonWebTokens;

namespace HoneyAn.Infrastructure.Identity;

public sealed class IdentityService(
    UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole<Guid>> roleManager,
    ApplicationDbContext dbContext,
    IOptions<JwtOptions> jwtOptions)
    : IAuthenticationService, IUserManagementService, IUserStatusValidator, IAdminBootstrapper
{
    private readonly JwtOptions _jwt = jwtOptions.Value;

    public async Task<AuthTokenDto> LoginAsync(LoginCommand command, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(command.Email.Trim());
        if (user is null || !user.IsActive || !await userManager.CheckPasswordAsync(user, command.Password))
        {
            throw new AuthenticationException();
        }

        return await IssueSessionAsync(user, Guid.NewGuid(), command.IpAddress, command.UserAgent, cancellationToken);
    }

    public async Task<AuthTokenDto> RefreshAsync(RefreshCommand command, CancellationToken cancellationToken)
    {
        var hash = HashToken(command.RefreshToken);
        var session = await dbContext.RefreshSessions.SingleOrDefaultAsync(
            item => item.TokenHash == hash,
            cancellationToken);

        if (session is null)
        {
            throw new AuthenticationException("Invalid refresh session.");
        }

        var now = DateTimeOffset.UtcNow;
        if (!session.IsActive(now))
        {
            if (session.RevokedAt is not null && session.ReplacedByTokenHash is not null)
            {
                await RevokeFamilyAsync(session.FamilyId, now, cancellationToken);
            }

            throw new AuthenticationException("Invalid refresh session.");
        }

        var user = await userManager.FindByIdAsync(session.UserId.ToString());
        if (user is null || !user.IsActive)
        {
            await RevokeFamilyAsync(session.FamilyId, now, cancellationToken);
            throw new AuthenticationException("Invalid refresh session.");
        }

        var replacementToken = CreateOpaqueToken();
        var replacementHash = HashToken(replacementToken);
        session.RevokedAt = now;
        session.ReplacedByTokenHash = replacementHash;

        dbContext.RefreshSessions.Add(new RefreshSession
        {
            UserId = user.Id,
            FamilyId = session.FamilyId,
            TokenHash = replacementHash,
            CreatedAt = now,
            ExpiresAt = now.AddDays(_jwt.RefreshTokenDays),
            CreatedByIp = command.IpAddress,
            UserAgent = Truncate(command.UserAgent, 512)
        });
        await dbContext.SaveChangesAsync(cancellationToken);

        return await CreateAuthResultAsync(user, replacementToken, now, cancellationToken);
    }

    public async Task LogoutAsync(Guid userId, string? refreshToken, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            return;
        }

        var hash = HashToken(refreshToken);
        var session = await dbContext.RefreshSessions.SingleOrDefaultAsync(
            item => item.UserId == userId && item.TokenHash == hash,
            cancellationToken);

        if (session is not null && session.RevokedAt is null)
        {
            session.RevokedAt = DateTimeOffset.UtcNow;
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<CurrentUserDto> GetCurrentUserAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(userId.ToString())
            ?? throw new AuthenticationException();
        return await ToCurrentUserAsync(user);
    }

    public async Task<PagedResult<UserListItemDto>> ListAsync(
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var query = userManager.Users.AsNoTracking().OrderBy(user => user.DisplayName);
        var total = await query.CountAsync(cancellationToken);
        var users = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        var items = new List<UserListItemDto>(users.Count);

        foreach (var user in users)
        {
            items.Add(await ToListItemAsync(user));
        }

        return new PagedResult<UserListItemDto>(items, page, pageSize, total);
    }

    public async Task<UserListItemDto> CreateAsync(
        CreateUserCommand command,
        CancellationToken cancellationToken)
    {
        if (!AppRoles.All.Contains(command.Role))
        {
            throw new RequestValidationException("Invalid role.", new Dictionary<string, string[]>
            {
                ["role"] = ["Role must be Admin or Sales."]
            });
        }

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = command.Email.Trim(),
            Email = command.Email.Trim(),
            DisplayName = command.DisplayName.Trim(),
            IsActive = true,
            MustChangePassword = true,
            EmailConfirmed = true
        };

        var creation = await userManager.CreateAsync(user, command.InitialPassword);
        EnsureIdentitySucceeded(creation);
        await EnsureRoleAsync(command.Role);
        EnsureIdentitySucceeded(await userManager.AddToRoleAsync(user, command.Role));
        return await ToListItemAsync(user);
    }

    public async Task<UserListItemDto> UpdateStatusAsync(
        UpdateUserStatusCommand command,
        CancellationToken cancellationToken)
    {
        if (command.UserId == command.ActingUserId && !command.IsActive)
        {
            throw new ConflictException("You cannot disable your own account.");
        }

        var user = await userManager.FindByIdAsync(command.UserId.ToString())
            ?? throw new NotFoundException("User was not found.");
        user.IsActive = command.IsActive;
        EnsureIdentitySucceeded(await userManager.UpdateAsync(user));

        if (!command.IsActive)
        {
            var now = DateTimeOffset.UtcNow;
            var sessions = await dbContext.RefreshSessions
                .Where(session => session.UserId == user.Id && session.RevokedAt == null)
                .ToListAsync(cancellationToken);
            sessions.ForEach(session => session.RevokedAt = now);
            await dbContext.SaveChangesAsync(cancellationToken);
            await userManager.UpdateSecurityStampAsync(user);
        }

        return await ToListItemAsync(user);
    }

    public async Task<bool> IsActiveAsync(Guid userId, CancellationToken cancellationToken) =>
        await userManager.Users.AnyAsync(user => user.Id == userId && user.IsActive, cancellationToken);

    public async Task BootstrapAsync(
        string email,
        string displayName,
        string password,
        CancellationToken cancellationToken)
    {
        await EnsureRoleAsync(AppRoles.Admin);
        await EnsureRoleAsync(AppRoles.Sales);

        if (await userManager.GetUsersInRoleAsync(AppRoles.Admin) is { Count: > 0 })
        {
            throw new ConflictException("An Admin account already exists; bootstrap was not performed.");
        }

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = email.Trim(),
            Email = email.Trim(),
            DisplayName = displayName.Trim(),
            IsActive = true,
            MustChangePassword = false,
            EmailConfirmed = true
        };
        EnsureIdentitySucceeded(await userManager.CreateAsync(user, password));
        EnsureIdentitySucceeded(await userManager.AddToRoleAsync(user, AppRoles.Admin));
    }

    private async Task<AuthTokenDto> IssueSessionAsync(
        ApplicationUser user,
        Guid familyId,
        string? ipAddress,
        string? userAgent,
        CancellationToken cancellationToken)
    {
        var now = DateTimeOffset.UtcNow;
        var refreshToken = CreateOpaqueToken();
        dbContext.RefreshSessions.Add(new RefreshSession
        {
            UserId = user.Id,
            FamilyId = familyId,
            TokenHash = HashToken(refreshToken),
            CreatedAt = now,
            ExpiresAt = now.AddDays(_jwt.RefreshTokenDays),
            CreatedByIp = ipAddress,
            UserAgent = Truncate(userAgent, 512)
        });
        await dbContext.SaveChangesAsync(cancellationToken);
        return await CreateAuthResultAsync(user, refreshToken, now, cancellationToken);
    }

    private async Task<AuthTokenDto> CreateAuthResultAsync(
        ApplicationUser user,
        string refreshToken,
        DateTimeOffset now,
        CancellationToken cancellationToken)
    {
        var roles = await userManager.GetRolesAsync(user);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var expires = now.AddMinutes(_jwt.AccessTokenMinutes);
        var descriptor = new SecurityTokenDescriptor
        {
            Issuer = _jwt.Issuer,
            Audience = _jwt.Audience,
            Subject = new ClaimsIdentity(claims),
            IssuedAt = now.UtcDateTime,
            Expires = expires.UtcDateTime,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.SigningKey)),
                SecurityAlgorithms.HmacSha256)
        };
        var token = new JsonWebTokenHandler().CreateToken(descriptor);
        var currentUser = new CurrentUserDto(
            user.Id,
            user.DisplayName,
            user.Email!,
            roles.ToArray(),
            user.IsActive,
            user.MustChangePassword);

        return new AuthTokenDto(
            token,
            "Bearer",
            (int)(expires - now).TotalSeconds,
            currentUser,
            refreshToken,
            now.AddDays(_jwt.RefreshTokenDays),
            CreateOpaqueToken());
    }

    private async Task RevokeFamilyAsync(Guid familyId, DateTimeOffset now, CancellationToken cancellationToken)
    {
        var sessions = await dbContext.RefreshSessions
            .Where(session => session.FamilyId == familyId && session.RevokedAt == null)
            .ToListAsync(cancellationToken);
        sessions.ForEach(session => session.RevokedAt = now);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task<CurrentUserDto> ToCurrentUserAsync(ApplicationUser user) =>
        new(user.Id, user.DisplayName, user.Email!, (await userManager.GetRolesAsync(user)).ToArray(),
            user.IsActive, user.MustChangePassword);

    private async Task<UserListItemDto> ToListItemAsync(ApplicationUser user) =>
        new(user.Id, user.DisplayName, user.Email!, (await userManager.GetRolesAsync(user)).ToArray(),
            user.IsActive, user.MustChangePassword, user.CreatedAt);

    private async Task EnsureRoleAsync(string role)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            EnsureIdentitySucceeded(await roleManager.CreateAsync(new IdentityRole<Guid>(role)));
        }
    }

    private static void EnsureIdentitySucceeded(IdentityResult result)
    {
        if (result.Succeeded)
        {
            return;
        }

        var errors = result.Errors
            .GroupBy(error => error.Code)
            .ToDictionary(group => group.Key, group => group.Select(error => error.Description).ToArray());
        throw new RequestValidationException("Identity validation failed.", errors);
    }

    private static string CreateOpaqueToken() =>
        Microsoft.AspNetCore.WebUtilities.WebEncoders.Base64UrlEncode(RandomNumberGenerator.GetBytes(64));

    private static string HashToken(string token) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

    private static string? Truncate(string? value, int maxLength) =>
        string.IsNullOrWhiteSpace(value) ? null : value[..Math.Min(value.Length, maxLength)];
}
