using HoneyAn.Api.Contracts.Auth.Responses;
using HoneyAn.Application.Features.Auth.Models;

namespace HoneyAn.Api.Mappings;

public static class AuthMapper
{
    public static AccessTokenResponse ToResponse(AuthResult result) =>
        new(result.AccessToken, result.TokenType, result.ExpiresIn, ToResponse(result.User));

    public static CurrentUserResponse ToResponse(CurrentUserResult result) =>
        new(result.Id, result.DisplayName, result.Email, result.Roles, result.IsActive, result.MustChangePassword);
}
