using HoneyAn.Application.Identity;

namespace HoneyAn.Api.Models;

public sealed record LoginRequest(string Email, string Password);
public sealed record CreateUserRequest(string Email, string DisplayName, string Role, string InitialPassword);
public sealed record UpdateUserStatusRequest(bool IsActive);

public sealed record AccessTokenResponse(
    string AccessToken,
    string TokenType,
    int ExpiresIn,
    CurrentUserDto User)
{
    public static AccessTokenResponse From(AuthTokenDto result) =>
        new(result.AccessToken, result.TokenType, result.ExpiresIn, result.User);
}
