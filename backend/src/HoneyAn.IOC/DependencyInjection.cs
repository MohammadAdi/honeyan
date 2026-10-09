using System.Security.Claims;
using System.Text;
using HoneyAn.Application.Abstractions.Authentication;
using HoneyAn.Application.Abstractions.Persistence;
using HoneyAn.Application;
using HoneyAn.Application.Common.Behaviors;
using FluentValidation;
using MediatR;
using HoneyAn.Domain.Identity;
using HoneyAn.Infrastructure.Identity;
using HoneyAn.Infrastructure.Persistence;
using HoneyAn.Infrastructure.Persistence.Seeding;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace HoneyAn.IOC;

public static class DependencyInjection
{
    public static IServiceCollection AddHoneyAnServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "Connection string 'DefaultConnection' is not configured.");

        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));
        services.Configure<AuthCookieOptions>(configuration.GetSection(AuthCookieOptions.SectionName));
        services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));
        services.AddIdentityCore<ApplicationUser>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.Password.RequiredLength = 12;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Lockout.AllowedForNewUsers = true;
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
            })
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<ApplicationDbContext>();

        services.AddScoped<IdentityService>();
        services.AddScoped<IAuthenticationService>(provider => provider.GetRequiredService<IdentityService>());
        services.AddScoped<IUserRepository>(provider => provider.GetRequiredService<IdentityService>());
        services.AddScoped<IUserStatusValidator>(provider => provider.GetRequiredService<IdentityService>());
        services.AddScoped<IDatabaseSeeder, DatabaseSeeder>();

        services.AddMediatR(options => options.RegisterServicesFromAssembly(typeof(AssemblyReference).Assembly));
        services.AddValidatorsFromAssembly(typeof(AssemblyReference).Assembly);
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

        var jwt = configuration.GetRequiredSection(JwtOptions.SectionName).Get<JwtOptions>()
            ?? throw new InvalidOperationException("JWT configuration is missing.");
        if (Encoding.UTF8.GetByteCount(jwt.SigningKey) < 32)
        {
            throw new InvalidOperationException("JWT signing key must be at least 32 bytes.");
        }

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.MapInboundClaims = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwt.Issuer,
                    ValidateAudience = true,
                    ValidAudience = jwt.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.SigningKey)),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromSeconds(30),
                    ValidAlgorithms = [SecurityAlgorithms.HmacSha256],
                    NameClaimType = ClaimTypes.NameIdentifier,
                    RoleClaimType = ClaimTypes.Role
                };
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        var subject = context.Principal?.FindFirstValue("sub")
                            ?? context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
                        if (!Guid.TryParse(subject, out var userId))
                        {
                            context.Fail("Invalid subject.");
                            return;
                        }

                        var validator = context.HttpContext.RequestServices.GetRequiredService<IUserStatusValidator>();
                        if (!await validator.IsActiveAsync(userId, context.HttpContext.RequestAborted))
                        {
                            context.Fail("User is disabled.");
                        }
                    }
                };
            });

        services.AddAuthorizationBuilder()
            .SetFallbackPolicy(new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build())
            .AddPolicy(AppRoles.Admin, policy => policy.RequireRole(AppRoles.Admin))
            .AddPolicy(AppRoles.Sales, policy => policy.RequireRole(AppRoles.Sales, AppRoles.Admin));

        return services;
    }
}
