using HoneyAn.Application.Features.Auth.Models;

namespace HoneyAn.Application.Abstractions.Authentication;

public interface IAuthenticationService
{
    Task<AuthResult> LoginAsync(
        string email,
        string password,
        string? ipAddress,
        string? userAgent,
        CancellationToken cancellationToken);

    Task<AuthResult> RefreshAsync(
        string refreshToken,
        string? ipAddress,
        string? userAgent,
        CancellationToken cancellationToken);

    Task LogoutAsync(Guid userId, string? refreshToken, CancellationToken cancellationToken);
    Task<CurrentUserResult> GetCurrentUserAsync(Guid userId, CancellationToken cancellationToken);
}

public interface IUserStatusValidator
{
    Task<bool> IsActiveAsync(Guid userId, CancellationToken cancellationToken);
}
