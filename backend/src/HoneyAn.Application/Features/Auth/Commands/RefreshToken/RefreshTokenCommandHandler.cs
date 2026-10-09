using HoneyAn.Application.Abstractions.Authentication;
using HoneyAn.Application.Features.Auth.Models;
using MediatR;

namespace HoneyAn.Application.Features.Auth.Commands.RefreshToken;

public sealed class RefreshTokenCommandHandler(IAuthenticationService authentication)
    : IRequestHandler<RefreshTokenCommand, AuthResult>
{
    public Task<AuthResult> Handle(RefreshTokenCommand request, CancellationToken cancellationToken) =>
        authentication.RefreshAsync(
            request.RefreshToken,
            request.IpAddress,
            request.UserAgent,
            cancellationToken);
}
