namespace HoneyAn.Application.Features.Auth.Models;

public sealed record AuthResult(
    string AccessToken,
    string TokenType,
    int ExpiresIn,
    CurrentUserResult User,
    string RefreshToken,
    DateTimeOffset RefreshExpiresAt,
    string CsrfToken);
