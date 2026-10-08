using HoneyAn.Application.Identity;
using HoneyAn.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;

namespace HoneyAn.IntegrationTests;

public sealed class HoneyAnApiFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseName = $"honeyan-{Guid.NewGuid()}";
    public const string AdminEmail = "admin@honeyan.test";
    public const string AdminPassword = "Test-Admin-Password-123!";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        Environment.SetEnvironmentVariable(
            "ConnectionStrings__DefaultConnection",
            "Host=localhost;Database=honeyan_tests;Username=postgres;Password=postgres");
        Environment.SetEnvironmentVariable(
            "Jwt__SigningKey",
            "integration-test-signing-key-that-is-long-enough-123456789");

        builder.ConfigureLogging(logging => logging.ClearProviders());
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<ApplicationDbContext>>();
            services.RemoveAll<IDbContextOptionsConfiguration<ApplicationDbContext>>();
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase(_databaseName));
        });
    }

    public async Task BootstrapAdminAsync()
    {
        using var scope = Services.CreateScope();
        await scope.ServiceProvider.GetRequiredService<IAdminBootstrapper>()
            .BootstrapAsync(AdminEmail, "Test Admin", AdminPassword, CancellationToken.None);
    }
}
