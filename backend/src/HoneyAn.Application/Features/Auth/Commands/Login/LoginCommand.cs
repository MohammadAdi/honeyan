using HoneyAn.Application.Features.Auth.Models;
using MediatR;

namespace HoneyAn.Application.Features.Auth.Commands.Login;

public sealed record LoginCommand(
    string Email,
    string Password,
    string? IpAddress,
    string? UserAgent) : IRequest<AuthResult>;
