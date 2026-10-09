using HoneyAn.Application.Abstractions.Persistence;
using HoneyAn.Application.Features.Users.Models;
using MediatR;

namespace HoneyAn.Application.Features.Users.Commands.UpdateUserStatus;

public sealed class UpdateUserStatusCommandHandler(IUserRepository users)
    : IRequestHandler<UpdateUserStatusCommand, UserResult>
{
    public Task<UserResult> Handle(UpdateUserStatusCommand request, CancellationToken cancellationToken) =>
        users.UpdateStatusAsync(
            request.UserId,
            request.IsActive,
            request.ActingUserId,
            cancellationToken);
}
