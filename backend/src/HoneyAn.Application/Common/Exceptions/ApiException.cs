namespace HoneyAn.Application.Common.Exceptions;

public abstract class ApiException(string message) : Exception(message)
{
    public abstract int StatusCode { get; }
    public abstract string ErrorCode { get; }
}

public sealed class AuthenticationException(string message = "Invalid credentials.") : ApiException(message)
{
    public override int StatusCode => 401;
    public override string ErrorCode => "authentication_failed";
}

public sealed class ForbiddenException(string message = "You do not have permission to perform this action.") : ApiException(message)
{
    public override int StatusCode => 403;
    public override string ErrorCode => "forbidden";
}

public sealed class NotFoundException(string message) : ApiException(message)
{
    public override int StatusCode => 404;
    public override string ErrorCode => "not_found";
}

public sealed class ConflictException(string message) : ApiException(message)
{
    public override int StatusCode => 409;
    public override string ErrorCode => "conflict";
}

public sealed class RequestValidationException(
    string message,
    IReadOnlyDictionary<string, string[]> errors) : ApiException(message)
{
    public IReadOnlyDictionary<string, string[]> Errors { get; } = errors;
    public override int StatusCode => 400;
    public override string ErrorCode => "validation_failed";
}
