using HoneyAn.Application.Common.Exceptions;
using HoneyAn.Application.Abstractions.Persistence;
using HoneyAn.Domain.Identity;
using HoneyAn.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace HoneyAn.Infrastructure.Persistence.Seeding;

public sealed class DatabaseSeeder(
    UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole<Guid>> roleManager) : IDatabaseSeeder
{
    public async Task SeedAsync(
        string? email,
        string? displayName,
        string? password,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        await EnsureRoleAsync(AppRoles.Admin);
        await EnsureRoleAsync(AppRoles.Sales);

        var values = new[] { email, displayName, password };
        if (values.All(string.IsNullOrWhiteSpace))
        {
            return;
        }

        if (values.Any(string.IsNullOrWhiteSpace))
        {
            throw new RequestValidationException(
                "Admin seed configuration is incomplete.",
                new Dictionary<string, string[]>
                {
                    ["seedAdmin"] = ["Email, display name, and password must be supplied together."]
                });
        }

        var user = await userManager.FindByEmailAsync(email!.Trim());
        if (user is null)
        {
            user = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = email.Trim(),
                Email = email.Trim(),
                DisplayName = displayName!.Trim(),
                IsActive = true,
                MustChangePassword = false,
                EmailConfirmed = true
            };
            EnsureSucceeded(await userManager.CreateAsync(user, password!));
        }

        if (!await userManager.IsInRoleAsync(user, AppRoles.Admin))
        {
            EnsureSucceeded(await userManager.AddToRoleAsync(user, AppRoles.Admin));
        }
    }

    private async Task EnsureRoleAsync(string role)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            EnsureSucceeded(await roleManager.CreateAsync(new IdentityRole<Guid>(role)));
        }
    }

    private static void EnsureSucceeded(IdentityResult result)
    {
        if (result.Succeeded)
        {
            return;
        }

        throw new RequestValidationException(
            "Database seed validation failed.",
            result.Errors.GroupBy(error => error.Code)
                .ToDictionary(group => group.Key, group => group.Select(error => error.Description).ToArray()));
    }
}
