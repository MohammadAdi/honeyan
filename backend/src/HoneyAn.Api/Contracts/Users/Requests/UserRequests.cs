namespace HoneyAn.Api.Contracts.Users.Requests;

public sealed record CreateUserRequest(string Email, string DisplayName, string Role, string InitialPassword);
public sealed record UpdateUserStatusRequest(bool IsActive);
