using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
public class HealthController : ControllerBase
{
    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok("Healthy");
    }
}