using HoneyAn.Application.Abstractions.Persistence;
using HoneyAn.Application.Common.Models;
using HoneyAn.Application.Features.Users.Models;
using MediatR;

namespace HoneyAn.Application.Features.Users.Queries.GetUsers;

public sealed class GetUsersQueryHandler(IUserRepository users)
    : IRequestHandler<GetUsersQuery, PagedResult<UserResult>>
{
    public Task<PagedResult<UserResult>> Handle(GetUsersQuery request, CancellationToken cancellationToken) =>
        users.ListAsync(request.Page, request.PageSize, cancellationToken);
}
