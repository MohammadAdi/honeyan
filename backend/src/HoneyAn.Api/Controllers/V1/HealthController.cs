using HoneyAn.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HoneyAn.Api.Controllers.V1;

[ApiController]
[Route("api/v1/health")]
public sealed class HealthController : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public ActionResult<HealthResponse> Get() =>
        Ok(new HealthResponse("Healthy", DateTimeOffset.UtcNow));
}
