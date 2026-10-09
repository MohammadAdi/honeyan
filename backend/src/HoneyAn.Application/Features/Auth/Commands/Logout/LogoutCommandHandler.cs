using HoneyAn.Application.Abstractions.Authentication;
using MediatR;

namespace HoneyAn.Application.Features.Auth.Commands.Logout;

public sealed class LogoutCommandHandler(IAuthenticationService authentication)
    : IRequestHandler<LogoutCommand>
{
    public async Task Handle(LogoutCommand request, CancellationToken cancellationToken) =>
        await authentication.LogoutAsync(request.UserId, request.RefreshToken, cancellationToken);
}
