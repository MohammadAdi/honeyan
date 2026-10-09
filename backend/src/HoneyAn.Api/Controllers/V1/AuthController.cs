using System.Security.Claims;
using HoneyAn.Api.Contracts.Auth.Requests;
using HoneyAn.Api.Contracts.Auth.Responses;
using HoneyAn.Api.Extensions;
using HoneyAn.Api.Mappings;
using HoneyAn.Application.Common.Exceptions;
using HoneyAn.Application.Features.Auth.Commands.Login;
using HoneyAn.Application.Features.Auth.Commands.Logout;
using HoneyAn.Application.Features.Auth.Commands.RefreshToken;
using HoneyAn.Application.Features.Auth.Queries.GetCurrentUser;
using HoneyAn.Infrastructure.Identity;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;

namespace HoneyAn.Api.Controllers.V1;

[ApiController]
[Route("api/v1/auth")]
public sealed class AuthController(
    ISender sender,
    IOptions<AuthCookieOptions> cookieOptions,
    IConfiguration configuration) : ControllerBase
{
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    [HttpPost("login")]
    [ProducesResponseType<AccessTokenResponse>(StatusCodes.Status200OK)]
    public async Task<ActionResult<AccessTokenResponse>> Login(
        LoginRequest request,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(new LoginCommand(
            request.Email,
            request.Password,
            HttpContext.Connection.RemoteIpAddress?.ToString(),
            Request.Headers.UserAgent.ToString()), cancellationToken);
        Response.SetAuthCookies(result, cookieOptions.Value);
        return Ok(AuthMapper.ToResponse(result));
    }

    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    [HttpPost("refresh")]
    public async Task<ActionResult<AccessTokenResponse>> Refresh(CancellationToken cancellationToken)
    {
        var options = cookieOptions.Value;
        Request.ValidateCsrf(options, configuration);
        if (!Request.Cookies.TryGetValue(options.RefreshCookieName, out var refreshToken))
        {
            throw new AuthenticationException("Invalid refresh session.");
        }

        try
        {
            var result = await sender.Send(new RefreshTokenCommand(
                refreshToken,
                HttpContext.Connection.RemoteIpAddress?.ToString(),
                Request.Headers.UserAgent.ToString()), cancellationToken);
            Response.SetAuthCookies(result, options);
            return Ok(AuthMapper.ToResponse(result));
        }
        catch (AuthenticationException)
        {
            Response.ClearAuthCookies(options);
            throw;
        }
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        var options = cookieOptions.Value;
        Request.ValidateCsrf(options, configuration);
        Request.Cookies.TryGetValue(options.RefreshCookieName, out var refreshToken);
        await sender.Send(new LogoutCommand(GetUserId(), refreshToken), cancellationToken);
        Response.ClearAuthCookies(options);
        return NoContent();
    }

    [HttpGet("me")]
    public async Task<ActionResult<CurrentUserResponse>> Me(CancellationToken cancellationToken) =>
        Ok(AuthMapper.ToResponse(await sender.Send(new GetCurrentUserQuery(GetUserId()), cancellationToken)));

    private Guid GetUserId()
    {
        var value = User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(value, out var userId) ? userId : throw new AuthenticationException();
    }
}
