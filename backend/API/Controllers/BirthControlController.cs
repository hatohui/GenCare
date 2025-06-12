using Application.DTOs.BirthControl.Request;
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
    [HttpPost]
    public async Task<IActionResult> CreateBirthControl([FromBody] CreateBirthControlRequest request)
    {
        try
        {
            await birthControlService.AddBirthControlAsync(request);
            return Ok(200);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
           
            return StatusCode(500, "Something went wrong.");
        }
    }
    
}