using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using HoneyAn.Api.Contracts.Auth.Responses;
using HoneyAn.Api.Contracts.Users.Responses;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace HoneyAn.IntegrationTests;

public sealed class AuthenticationEndpointsTests : IClassFixture<HoneyAnApiFactory>
{
    private readonly HoneyAnApiFactory _factory;

    public AuthenticationEndpointsTests(HoneyAnApiFactory factory) => _factory = factory;

    [Fact]
    public async Task AuthenticationLifecycle_EnforcesRotationRevocationAndRoles()
    {
        await _factory.BootstrapAdminAsync();
        using var adminClient = CreateClient();

        var invalidLogin = await adminClient.PostAsJsonAsync("/api/v1/auth/login", new
        {
            email = HoneyAnApiFactory.AdminEmail,
            password = "wrong-password"
        });
        Assert.Equal(HttpStatusCode.Unauthorized, invalidLogin.StatusCode);

        var login = await LoginAsync(adminClient, HoneyAnApiFactory.AdminEmail, HoneyAnApiFactory.AdminPassword);
        adminClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", login.Body.AccessToken);

        var createSales = await adminClient.PostAsJsonAsync("/api/v1/users", new
        {
            email = "sales@honeyan.test",
            displayName = "Test Sales",
            role = "Sales",
            initialPassword = "Test-Sales-Password-123!"
        });
        Assert.Equal(HttpStatusCode.Created, createSales.StatusCode);
        var sales = await createSales.Content.ReadFromJsonAsync<UserResponse>();
        Assert.NotNull(sales);

        using var salesClient = CreateClient();
        var salesLogin = await LoginAsync(salesClient, "sales@honeyan.test", "Test-Sales-Password-123!");
        salesClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", salesLogin.Body.AccessToken);
        Assert.Equal(HttpStatusCode.Forbidden, (await salesClient.GetAsync("/api/v1/users")).StatusCode);

        var refreshRequest = new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/refresh");
        refreshRequest.Headers.Add("X-CSRF-TOKEN", salesLogin.CsrfToken);
        var refresh = await salesClient.SendAsync(refreshRequest);
        Assert.Equal(HttpStatusCode.OK, refresh.StatusCode);
        var refreshedBody = await refresh.Content.ReadFromJsonAsync<AccessTokenResponse>();
        Assert.NotNull(refreshedBody);
        Assert.NotEqual(salesLogin.Body.AccessToken, refreshedBody.AccessToken);

        using var replayClient = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
            HandleCookies = false
        });
        var replay = new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/refresh");
        replay.Headers.Add("Cookie", $"honeyan.refresh={salesLogin.RefreshToken}; honeyan.csrf={salesLogin.CsrfToken}");
        replay.Headers.Add("X-CSRF-TOKEN", salesLogin.CsrfToken);
        Assert.Equal(HttpStatusCode.Unauthorized, (await replayClient.SendAsync(replay)).StatusCode);

        var disable = await adminClient.PatchAsJsonAsync($"/api/v1/users/{sales.Id}/status", new {isActive = false});
        Assert.Equal(HttpStatusCode.OK, disable.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await salesClient.GetAsync("/api/v1/auth/me")).StatusCode);

        var logout = new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/logout");
        logout.Headers.Add("X-CSRF-TOKEN", login.CsrfToken);
        Assert.Equal(HttpStatusCode.NoContent, (await adminClient.SendAsync(logout)).StatusCode);

        var loggedOutRefresh = new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/refresh");
        loggedOutRefresh.Headers.Add("Cookie", $"honeyan.refresh={login.RefreshToken}; honeyan.csrf={login.CsrfToken}");
        loggedOutRefresh.Headers.Add("X-CSRF-TOKEN", login.CsrfToken);
        Assert.Equal(HttpStatusCode.Unauthorized, (await replayClient.SendAsync(loggedOutRefresh)).StatusCode);
    }

    [Fact]
    public async Task ProtectedEndpoint_WithoutToken_ReturnsUnauthorized()
    {
        using var client = CreateClient();
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/v1/auth/me")).StatusCode);
    }

    [Fact]
    public async Task HealthEndpoint_IsAnonymous()
    {
        using var client = CreateClient();
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/api/v1/health")).StatusCode);
    }

    [Fact]
    public async Task ExpiredAccessToken_ReturnsUnauthorized()
    {
        using var client = CreateClient();
        var now = DateTime.UtcNow;
        var token = new JsonWebTokenHandler().CreateToken(new SecurityTokenDescriptor
        {
            Issuer = "HoneyAn.Api",
            Audience = "HoneyAn.Backoffice",
            Subject = new ClaimsIdentity([new Claim("sub", Guid.NewGuid().ToString())]),
            NotBefore = now.AddMinutes(-2),
            Expires = now.AddMinutes(-1),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                    "integration-test-signing-key-that-is-long-enough-123456789")),
                SecurityAlgorithms.HmacSha256)
        });
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/v1/auth/me")).StatusCode);
    }

    private HttpClient CreateClient() => _factory.CreateClient(new WebApplicationFactoryClientOptions
    {
        AllowAutoRedirect = false,
        HandleCookies = true
    });

    private static async Task<LoginResult> LoginAsync(HttpClient client, string email, string password)
    {
        var response = await client.PostAsJsonAsync("/api/v1/auth/login", new {email, password});
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<AccessTokenResponse>();
        Assert.NotNull(body);

        var setCookies = response.Headers.GetValues("Set-Cookie").ToArray();
        return new LoginResult(
            body,
            GetCookie(setCookies, "honeyan.refresh"),
            GetCookie(setCookies, "honeyan.csrf"));
    }

    private static string GetCookie(IEnumerable<string> headers, string name)
    {
        var prefix = $"{name}=";
        var cookie = headers.First(header => header.StartsWith(prefix, StringComparison.Ordinal));
        return cookie[prefix.Length..cookie.IndexOf(';')];
    }

    private sealed record LoginResult(AccessTokenResponse Body, string RefreshToken, string CsrfToken);
}
