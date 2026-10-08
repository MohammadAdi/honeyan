using System.Threading.RateLimiting;
using HoneyAn.Api.Endpoints;
using HoneyAn.Api.Middleware;
using HoneyAn.Api.Models;
using HoneyAn.Application.Common.Models;
using HoneyAn.Application.Identity;
using HoneyAn.IOC;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
builder.Services.AddHoneyAnServices(builder.Configuration);

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
{
    if (allowedOrigins.Length > 0)
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    }
}));
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("auth", context => RateLimitPartition.GetFixedWindowLimiter(
        context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 10,
            Window = TimeSpan.FromMinutes(1),
            QueueLimit = 0,
            AutoReplenishment = true
        }));
});

var app = builder.Build();

app.UseMiddleware<GlobalExceptionHandlingMiddleware>();
app.UseStatusCodePages(async statusCodeContext =>
{
    var response = statusCodeContext.HttpContext.Response;
    var title = response.StatusCode switch
    {
        StatusCodes.Status401Unauthorized => "unauthorized",
        StatusCodes.Status403Forbidden => "forbidden",
        StatusCodes.Status429TooManyRequests => "rate_limited",
        _ => "request_failed"
    };
    await response.WriteAsJsonAsync(new ProblemDetails
    {
        Status = response.StatusCode,
        Title = title,
        Detail = title switch
        {
            "unauthorized" => "Authentication is required.",
            "forbidden" => "You do not have permission to perform this action.",
            "rate_limited" => "Too many requests. Please try again later.",
            _ => "The request could not be completed."
        },
        Instance = statusCodeContext.HttpContext.Request.Path
    });
});

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/v1/health", () =>
        Results.Ok(ApiResponse<HealthResponse>.Ok(new HealthResponse("Healthy", DateTimeOffset.UtcNow))))
    .AllowAnonymous()
    .WithName("GetHealth")
    .WithTags("System");
app.MapAuthEndpoints();
app.MapUserEndpoints();

if (args.Contains("--bootstrap-admin", StringComparer.OrdinalIgnoreCase))
{
    await using var scope = app.Services.CreateAsyncScope();
    var email = RequireEnvironmentVariable("HONEYAN_BOOTSTRAP_EMAIL");
    var displayName = RequireEnvironmentVariable("HONEYAN_BOOTSTRAP_DISPLAY_NAME");
    var password = RequireEnvironmentVariable("HONEYAN_BOOTSTRAP_PASSWORD");
    await scope.ServiceProvider.GetRequiredService<IAdminBootstrapper>()
        .BootstrapAsync(email, displayName, password, CancellationToken.None);
    Console.WriteLine("Initial Admin account created.");
    return;
}

app.Run();

static string RequireEnvironmentVariable(string name) =>
    Environment.GetEnvironmentVariable(name)
    ?? throw new InvalidOperationException($"Required environment variable '{name}' is missing.");

public partial class Program;
