using MediatR;

namespace HoneyAn.Application.Features.Auth.Commands.Logout;

public sealed record LogoutCommand(Guid UserId, string? RefreshToken) : IRequest;
