namespace HoneyAn.Api.Contracts.Auth.Responses;

public sealed record AccessTokenResponse(
    string AccessToken,
    string TokenType,
    int ExpiresIn,
    CurrentUserResponse User);
