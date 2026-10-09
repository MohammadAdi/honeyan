using HoneyAn.Api.Contracts.Common;
using HoneyAn.Api.Contracts.Users.Requests;
using HoneyAn.Api.Contracts.Users.Responses;
using HoneyAn.Application.Common.Models;
using HoneyAn.Application.Features.Users.Commands.CreateUser;
using HoneyAn.Application.Features.Users.Commands.UpdateUserStatus;
using HoneyAn.Application.Features.Users.Models;

namespace HoneyAn.Api.Mappings;

public static class UserMapper
{
    public static CreateUserCommand ToCommand(CreateUserRequest request) =>
        new(request.Email, request.DisplayName, request.Role, request.InitialPassword);

    public static UpdateUserStatusCommand ToCommand(
        Guid userId,
        Guid actingUserId,
        UpdateUserStatusRequest request) =>
        new(userId, request.IsActive, actingUserId);

    public static UserResponse ToResponse(UserResult result) =>
        new(result.Id, result.DisplayName, result.Email, result.Roles, result.IsActive,
            result.MustChangePassword, result.CreatedAt);

    public static PagedResponse<UserResponse> ToResponse(PagedResult<UserResult> result) =>
        new(result.Items.Select(ToResponse).ToArray(), result.Page, result.PageSize, result.TotalCount);
}
