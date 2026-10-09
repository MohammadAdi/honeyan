namespace HoneyAn.Application.Features.Auth.Models;

public sealed record CurrentUserResult(
    Guid Id,
    string DisplayName,
    string Email,
    IReadOnlyCollection<string> Roles,
    bool IsActive,
    bool MustChangePassword);
