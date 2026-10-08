namespace HoneyAn.Application.Identity;

public sealed record CurrentUserDto(
    Guid Id,
    string DisplayName,
    string Email,
    IReadOnlyCollection<string> Roles,
    bool IsActive,
    bool MustChangePassword);

public sealed record AuthTokenDto(
    string AccessToken,
    string TokenType,
    int ExpiresIn,
    CurrentUserDto User,
    string RefreshToken,
    DateTimeOffset RefreshExpiresAt,
    string CsrfToken);

public sealed record LoginCommand(string Email, string Password, string? IpAddress, string? UserAgent);
public sealed record RefreshCommand(string RefreshToken, string? IpAddress, string? UserAgent);
public sealed record CreateUserCommand(string Email, string DisplayName, string Role, string InitialPassword);
public sealed record UpdateUserStatusCommand(Guid UserId, bool IsActive, Guid ActingUserId);

public sealed record UserListItemDto(
    Guid Id,
    string DisplayName,
    string Email,
    IReadOnlyCollection<string> Roles,
    bool IsActive,
    bool MustChangePassword,
    DateTimeOffset CreatedAt);

public sealed record PagedResult<T>(IReadOnlyCollection<T> Items, int Page, int PageSize, int TotalCount);

public interface IAuthenticationService
{
    Task<AuthTokenDto> LoginAsync(LoginCommand command, CancellationToken cancellationToken);
    Task<AuthTokenDto> RefreshAsync(RefreshCommand command, CancellationToken cancellationToken);
    Task LogoutAsync(Guid userId, string? refreshToken, CancellationToken cancellationToken);
    Task<CurrentUserDto> GetCurrentUserAsync(Guid userId, CancellationToken cancellationToken);
}

public interface IUserManagementService
{
    Task<PagedResult<UserListItemDto>> ListAsync(int page, int pageSize, CancellationToken cancellationToken);
    Task<UserListItemDto> CreateAsync(CreateUserCommand command, CancellationToken cancellationToken);
    Task<UserListItemDto> UpdateStatusAsync(UpdateUserStatusCommand command, CancellationToken cancellationToken);
}

public interface IUserStatusValidator
{
    Task<bool> IsActiveAsync(Guid userId, CancellationToken cancellationToken);
}

public interface IAdminBootstrapper
{
    Task BootstrapAsync(string email, string displayName, string password, CancellationToken cancellationToken);
}
