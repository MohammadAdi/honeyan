using HoneyAn.Application.Abstractions.Authentication;
using HoneyAn.Application.Features.Auth.Models;
using MediatR;

namespace HoneyAn.Application.Features.Auth.Queries.GetCurrentUser;

public sealed class GetCurrentUserQueryHandler(IAuthenticationService authentication)
    : IRequestHandler<GetCurrentUserQuery, CurrentUserResult>
{
    public Task<CurrentUserResult> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken) =>
        authentication.GetCurrentUserAsync(request.UserId, cancellationToken);
}
