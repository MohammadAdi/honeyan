using HoneyAn.Application.Features.Users.Models;
using MediatR;

namespace HoneyAn.Application.Features.Users.Commands.CreateUser;

public sealed record CreateUserCommand(
    string Email,
    string DisplayName,
    string Role,
    string InitialPassword) : IRequest<UserResult>;
