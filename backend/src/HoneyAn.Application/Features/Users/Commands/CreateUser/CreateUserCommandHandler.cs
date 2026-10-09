using HoneyAn.Application.Abstractions.Persistence;
using HoneyAn.Application.Features.Users.Models;
using MediatR;

namespace HoneyAn.Application.Features.Users.Commands.CreateUser;

public sealed class CreateUserCommandHandler(IUserRepository users)
    : IRequestHandler<CreateUserCommand, UserResult>
{
    public Task<UserResult> Handle(CreateUserCommand request, CancellationToken cancellationToken) =>
        users.CreateAsync(
            request.Email,
            request.DisplayName,
            request.Role,
            request.InitialPassword,
            cancellationToken);
}
