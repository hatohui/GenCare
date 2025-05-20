using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(string), 200)]
    public IActionResult Health()
    {
        return Ok("Healthy");
    }
}