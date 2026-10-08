using HoneyAn.Application.Common.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace HoneyAn.Api.Middleware;

public sealed class GlobalExceptionHandlingMiddleware(
    RequestDelegate next,
    ILogger<GlobalExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception exception)
        {
            if (context.Response.HasStarted)
            {
                throw;
            }

            var apiException = exception as ApiException;
            if (apiException is null)
            {
                logger.LogError(exception, "An unhandled exception occurred while processing the request.");
            }
            else
            {
                logger.LogWarning("Request failed with code {ErrorCode}.", apiException.ErrorCode);
            }

            var problem = new ProblemDetails
            {
                Status = apiException?.StatusCode ?? StatusCodes.Status500InternalServerError,
                Title = apiException?.ErrorCode ?? "internal_error",
                Detail = apiException?.Message ?? "An unexpected error occurred.",
                Instance = context.Request.Path
            };
            problem.Extensions["traceId"] = context.TraceIdentifier;
            if (apiException is RequestValidationException validation)
            {
                problem.Extensions["errors"] = validation.Errors;
            }

            context.Response.StatusCode = problem.Status.Value;
            await context.Response.WriteAsJsonAsync(problem);
        }
    }
}
