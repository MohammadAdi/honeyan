namespace HoneyAn.Application.Features.Users.Models;

public sealed record UserResult(
    Guid Id,
    string DisplayName,
    string Email,
    IReadOnlyCollection<string> Roles,
    bool IsActive,
    bool MustChangePassword,
    DateTimeOffset CreatedAt);
