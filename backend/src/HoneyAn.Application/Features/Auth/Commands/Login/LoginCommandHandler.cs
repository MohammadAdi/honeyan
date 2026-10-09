using HoneyAn.Application.Abstractions.Authentication;
using HoneyAn.Application.Features.Auth.Models;
using MediatR;

namespace HoneyAn.Application.Features.Auth.Commands.Login;

public sealed class LoginCommandHandler(IAuthenticationService authentication)
    : IRequestHandler<LoginCommand, AuthResult>
{
    public Task<AuthResult> Handle(LoginCommand request, CancellationToken cancellationToken) =>
        authentication.LoginAsync(
            request.Email,
            request.Password,
            request.IpAddress,
            request.UserAgent,
            cancellationToken);
}
