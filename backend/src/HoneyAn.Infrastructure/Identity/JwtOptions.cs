namespace HoneyAn.Infrastructure.Identity;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public required string Issuer { get; init; }
    public required string Audience { get; init; }
    public required string SigningKey { get; init; }
    public int AccessTokenMinutes { get; init; } = 15;
    public int RefreshTokenDays { get; init; } = 7;
}

public sealed class AuthCookieOptions
{
    public const string SectionName = "AuthCookie";

    public string RefreshCookieName { get; init; } = "honeyan.refresh";
    public string CsrfCookieName { get; init; } = "honeyan.csrf";
    public string CsrfHeaderName { get; init; } = "X-CSRF-TOKEN";
    public string Path { get; init; } = "/api/v1/auth";
    public bool Secure { get; init; } = true;
    public string SameSite { get; init; } = "Strict";
}
