using HoneyAn.Application.Features.Auth.Models;
using MediatR;

namespace HoneyAn.Application.Features.Auth.Commands.RefreshToken;

public sealed record RefreshTokenCommand(
    string RefreshToken,
    string? IpAddress,
    string? UserAgent) : IRequest<AuthResult>;
