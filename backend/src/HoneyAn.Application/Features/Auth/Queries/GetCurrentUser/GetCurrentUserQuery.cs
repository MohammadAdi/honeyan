using HoneyAn.Application.Features.Auth.Models;
using MediatR;

namespace HoneyAn.Application.Features.Auth.Queries.GetCurrentUser;

public sealed record GetCurrentUserQuery(Guid UserId) : IRequest<CurrentUserResult>;
