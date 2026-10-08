namespace HoneyAn.Application.Common.Models;

public sealed record ApiResponse<T>(
    bool Success,
    T? Data,
    string? Message,
    ApiError? Error)
{
    public static ApiResponse<T> Ok(T data, string? message = null) =>
        new(true, data, message, null);

    public static ApiResponse<T> Failure(string code, string detail) =>
        new(false, default, null, new ApiError(code, detail));
}
