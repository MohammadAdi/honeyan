namespace HoneyAn.Api.Contracts.Auth.Responses;

public sealed record CurrentUserResponse(
    Guid Id,
    string DisplayName,
    string Email,
    IReadOnlyCollection<string> Roles,
    bool IsActive,
    bool MustChangePassword);
