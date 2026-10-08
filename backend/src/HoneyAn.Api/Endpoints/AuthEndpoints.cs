using System.Security.Claims;
using System.Security.Cryptography;
using HoneyAn.Api.Models;
using HoneyAn.Application.Common.Exceptions;
using HoneyAn.Application.Identity;
using HoneyAn.Infrastructure.Identity;
using Microsoft.Extensions.Options;

namespace HoneyAn.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/v1/auth").WithTags("Authentication");

        group.MapPost("/login", LoginAsync)
            .AllowAnonymous()
            .RequireRateLimiting("auth");
        group.MapPost("/refresh", RefreshAsync)
            .AllowAnonymous()
            .RequireRateLimiting("auth");
        group.MapPost("/logout", LogoutAsync);
        group.MapGet("/me", MeAsync);

        return endpoints;
    }

    private static async Task<IResult> LoginAsync(
        LoginRequest request,
        HttpContext context,
        IAuthenticationService authentication,
        IOptions<AuthCookieOptions> cookieOptions,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            throw new AuthenticationException();
        }

        var result = await authentication.LoginAsync(
            new LoginCommand(request.Email, request.Password, GetIp(context), GetUserAgent(context)),
            cancellationToken);
        SetSessionCookies(context, result, cookieOptions.Value);
        return Results.Ok(AccessTokenResponse.From(result));
    }

    private static async Task<IResult> RefreshAsync(
        HttpContext context,
        IAuthenticationService authentication,
        IOptions<AuthCookieOptions> cookieOptions,
        IConfiguration configuration,
        CancellationToken cancellationToken)
    {
        var options = cookieOptions.Value;
        ValidateCsrf(context, options, configuration);
        if (!context.Request.Cookies.TryGetValue(options.RefreshCookieName, out var refreshToken))
        {
            throw new AuthenticationException("Invalid refresh session.");
        }

        try
        {
            var result = await authentication.RefreshAsync(
                new RefreshCommand(refreshToken, GetIp(context), GetUserAgent(context)),
                cancellationToken);
            SetSessionCookies(context, result, options);
            return Results.Ok(AccessTokenResponse.From(result));
        }
        catch (AuthenticationException)
        {
            ClearSessionCookies(context, options);
            throw;
        }
    }

    private static async Task<IResult> LogoutAsync(
        HttpContext context,
        IAuthenticationService authentication,
        IOptions<AuthCookieOptions> cookieOptions,
        IConfiguration configuration,
        CancellationToken cancellationToken)
    {
        var options = cookieOptions.Value;
        ValidateCsrf(context, options, configuration);
        var userId = GetUserId(context.User);
        context.Request.Cookies.TryGetValue(options.RefreshCookieName, out var refreshToken);
        await authentication.LogoutAsync(userId, refreshToken, cancellationToken);
        ClearSessionCookies(context, options);
        return Results.NoContent();
    }

    private static async Task<IResult> MeAsync(
        ClaimsPrincipal principal,
        IAuthenticationService authentication,
        CancellationToken cancellationToken) =>
        Results.Ok(await authentication.GetCurrentUserAsync(GetUserId(principal), cancellationToken));

    private static void SetSessionCookies(HttpContext context, AuthTokenDto result, AuthCookieOptions options)
    {
        var sameSite = ParseSameSite(options.SameSite);
        context.Response.Cookies.Append(options.RefreshCookieName, result.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = options.Secure,
            SameSite = sameSite,
            Path = options.Path,
            Expires = result.RefreshExpiresAt
        });
        context.Response.Cookies.Append(options.CsrfCookieName, result.CsrfToken, new CookieOptions
        {
            HttpOnly = false,
            Secure = options.Secure,
            SameSite = sameSite,
            Path = "/",
            Expires = result.RefreshExpiresAt
        });
    }

    private static void ClearSessionCookies(HttpContext context, AuthCookieOptions options)
    {
        context.Response.Cookies.Delete(options.RefreshCookieName, new CookieOptions { Path = options.Path });
        context.Response.Cookies.Delete(options.CsrfCookieName, new CookieOptions { Path = "/" });
    }

    private static void ValidateCsrf(HttpContext context, AuthCookieOptions options, IConfiguration configuration)
    {
        var cookie = context.Request.Cookies[options.CsrfCookieName];
        var header = context.Request.Headers[options.CsrfHeaderName].ToString();
        if (string.IsNullOrWhiteSpace(cookie) || string.IsNullOrWhiteSpace(header) ||
            !CryptographicOperations.FixedTimeEquals(
                System.Text.Encoding.UTF8.GetBytes(cookie),
                System.Text.Encoding.UTF8.GetBytes(header)))
        {
            throw new ForbiddenException("Invalid CSRF token.");
        }

        var origin = context.Request.Headers.Origin.ToString();
        var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
        if (!string.IsNullOrWhiteSpace(origin) &&
            !allowedOrigins.Contains(origin, StringComparer.OrdinalIgnoreCase))
        {
            throw new ForbiddenException("Origin is not allowed.");
        }
    }

    private static Guid GetUserId(ClaimsPrincipal principal)
    {
        var value = principal.FindFirstValue("sub") ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(value, out var userId) ? userId : throw new AuthenticationException();
    }

    private static string? GetIp(HttpContext context) => context.Connection.RemoteIpAddress?.ToString();
    private static string? GetUserAgent(HttpContext context) => context.Request.Headers.UserAgent.ToString();

    private static SameSiteMode ParseSameSite(string value) =>
        Enum.TryParse<SameSiteMode>(value, true, out var sameSite) ? sameSite : SameSiteMode.Strict;
}
