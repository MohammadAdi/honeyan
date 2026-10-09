namespace HoneyAn.Api.Contracts.Users.Responses;

public sealed record UserResponse(
    Guid Id,
    string DisplayName,
    string Email,
    IReadOnlyCollection<string> Roles,
    bool IsActive,
    bool MustChangePassword,
    DateTimeOffset CreatedAt);
