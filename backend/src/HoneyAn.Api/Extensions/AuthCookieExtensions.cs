using System.Security.Cryptography;
using HoneyAn.Application.Common.Exceptions;
using HoneyAn.Application.Features.Auth.Models;
using HoneyAn.Infrastructure.Identity;

namespace HoneyAn.Api.Extensions;

public static class AuthCookieExtensions
{
    public static void SetAuthCookies(this HttpResponse response, AuthResult result, AuthCookieOptions options)
    {
        var sameSite = ParseSameSite(options.SameSite);
        response.Cookies.Append(options.RefreshCookieName, result.RefreshToken, new CookieOptions
        {
            HttpOnly = true, Secure = options.Secure, SameSite = sameSite,
            Path = options.Path, Expires = result.RefreshExpiresAt
        });
        response.Cookies.Append(options.CsrfCookieName, result.CsrfToken, new CookieOptions
        {
            HttpOnly = false, Secure = options.Secure, SameSite = sameSite,
            Path = "/", Expires = result.RefreshExpiresAt
        });
    }

    public static void ClearAuthCookies(this HttpResponse response, AuthCookieOptions options)
    {
        response.Cookies.Delete(options.RefreshCookieName, new CookieOptions { Path = options.Path });
        response.Cookies.Delete(options.CsrfCookieName, new CookieOptions { Path = "/" });
    }

    public static void ValidateCsrf(this HttpRequest request, AuthCookieOptions options, IConfiguration configuration)
    {
        var cookie = request.Cookies[options.CsrfCookieName];
        var header = request.Headers[options.CsrfHeaderName].ToString();
        if (string.IsNullOrWhiteSpace(cookie) || string.IsNullOrWhiteSpace(header) ||
            !CryptographicOperations.FixedTimeEquals(
                System.Text.Encoding.UTF8.GetBytes(cookie),
                System.Text.Encoding.UTF8.GetBytes(header)))
        {
            throw new ForbiddenException("Invalid CSRF token.");
        }

        var origin = request.Headers.Origin.ToString();
        var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
        if (!string.IsNullOrWhiteSpace(origin) && !allowedOrigins.Contains(origin, StringComparer.OrdinalIgnoreCase))
        {
            throw new ForbiddenException("Origin is not allowed.");
        }
    }

    private static SameSiteMode ParseSameSite(string value) =>
        Enum.TryParse<SameSiteMode>(value, true, out var sameSite) ? sameSite : SameSiteMode.Strict;
}
