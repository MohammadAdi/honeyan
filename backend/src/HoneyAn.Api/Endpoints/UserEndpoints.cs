using System.Security.Claims;
using HoneyAn.Api.Models;
using HoneyAn.Application.Common.Exceptions;
using HoneyAn.Application.Identity;
using HoneyAn.Domain.Identity;

namespace HoneyAn.Api.Endpoints;

public static class UserEndpoints
{
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/v1/users")
            .WithTags("Users")
            .RequireAuthorization(AppRoles.Admin);

        group.MapGet("/", async (
            int? page,
            int? pageSize,
            IUserManagementService users,
            CancellationToken cancellationToken) =>
            Results.Ok(await users.ListAsync(page ?? 1, pageSize ?? 20, cancellationToken)));

        group.MapPost("/", async (
            CreateUserRequest request,
            IUserManagementService users,
            CancellationToken cancellationToken) =>
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.DisplayName) ||
                string.IsNullOrWhiteSpace(request.InitialPassword))
            {
                throw new RequestValidationException("Required fields are missing.", new Dictionary<string, string[]>
                {
                    ["request"] = ["Email, displayName, role, and initialPassword are required."]
                });
            }

            var user = await users.CreateAsync(
                new CreateUserCommand(request.Email, request.DisplayName, request.Role, request.InitialPassword),
                cancellationToken);
            return Results.Created($"/api/v1/users/{user.Id}", user);
        });

        group.MapPatch("/{id:guid}/status", async (
            Guid id,
            UpdateUserStatusRequest request,
            ClaimsPrincipal principal,
            IUserManagementService users,
            CancellationToken cancellationToken) =>
        {
            var subject = principal.FindFirstValue("sub") ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(subject, out var actingUserId))
            {
                throw new AuthenticationException();
            }

            return Results.Ok(await users.UpdateStatusAsync(
                new UpdateUserStatusCommand(id, request.IsActive, actingUserId),
                cancellationToken));
        });

        return endpoints;
    }
}
