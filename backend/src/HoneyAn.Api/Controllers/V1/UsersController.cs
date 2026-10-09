using System.Security.Claims;
using HoneyAn.Api.Contracts.Users.Requests;
using HoneyAn.Api.Contracts.Users.Responses;
using HoneyAn.Api.Contracts.Common;
using HoneyAn.Api.Mappings;
using HoneyAn.Application.Common.Exceptions;
using HoneyAn.Application.Features.Users.Queries.GetUsers;
using HoneyAn.Domain.Identity;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HoneyAn.Api.Controllers.V1;

[ApiController]
[Authorize(Policy = AppRoles.Admin)]
[Route("api/v1/users")]
public sealed class UsersController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResponse<UserResponse>>> GetUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default) =>
        Ok(UserMapper.ToResponse(await sender.Send(new GetUsersQuery(page, pageSize), cancellationToken)));

    [HttpPost]
    public async Task<ActionResult<UserResponse>> Create(
        CreateUserRequest request,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(UserMapper.ToCommand(request), cancellationToken);
        return Created($"/api/v1/users/{result.Id}", UserMapper.ToResponse(result));
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<UserResponse>> UpdateStatus(
        Guid id,
        UpdateUserStatusRequest request,
        CancellationToken cancellationToken)
    {
        var subject = User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(subject, out var actingUserId))
        {
            throw new AuthenticationException();
        }

        var result = await sender.Send(UserMapper.ToCommand(id, actingUserId, request), cancellationToken);
        return Ok(UserMapper.ToResponse(result));
    }
}
