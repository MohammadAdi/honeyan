using HoneyAn.Application.Common.Models;
using HoneyAn.Application.Features.Users.Models;
using MediatR;

namespace HoneyAn.Application.Features.Users.Queries.GetUsers;

public sealed record GetUsersQuery(int Page = 1, int PageSize = 20)
    : IRequest<PagedResult<UserResult>>;
