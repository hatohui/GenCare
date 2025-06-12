using Application.DTOs.BirthControl.Response;
using Application.Services;

namespace API.Controllers;

[ApiController]
[Route("api/birthcontrol")]
public class BirthControlController(IBirthControlService birthControlService): ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<ViewBirthControlResponse>> ViewBirthControlById(Guid id)
    {
        var result = await birthControlService.ViewBirthControlAsync(id);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }
    
    
}