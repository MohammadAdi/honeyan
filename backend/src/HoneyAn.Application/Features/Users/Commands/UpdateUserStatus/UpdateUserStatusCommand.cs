using HoneyAn.Application.Features.Users.Models;
using MediatR;

namespace HoneyAn.Application.Features.Users.Commands.UpdateUserStatus;

public sealed record UpdateUserStatusCommand(
    Guid UserId,
    bool IsActive,
    Guid ActingUserId) : IRequest<UserResult>;
