using HoneyAn.Application.Common.Models;
using HoneyAn.Application.Features.Users.Models;

namespace HoneyAn.Application.Abstractions.Persistence;

public interface IUserRepository
{
    Task<PagedResult<UserResult>> ListAsync(int page, int pageSize, CancellationToken cancellationToken);

    Task<UserResult> CreateAsync(
        string email,
        string displayName,
        string role,
        string initialPassword,
        CancellationToken cancellationToken);

    Task<UserResult> UpdateStatusAsync(
        Guid userId,
        bool isActive,
        Guid actingUserId,
        CancellationToken cancellationToken);
}

public interface IDatabaseSeeder
{
    Task SeedAsync(string? email, string? displayName, string? password, CancellationToken cancellationToken);
}
