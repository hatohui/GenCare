using Application.DTOs.BirthControl.Request;
using Application.Services;

namespace API.Controllers;

[ApiController]
[Route("api/birthcontrol")]
public class BirthControlController(IBirthControlService birthControlService) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<IActionResult> ViewBirthControlById(Guid id)
    {
        var result = await birthControlService.ViewBirthControlAsync(id);

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateBirthControl([FromBody] CreateBirthControlRequest request)
    {
        var created = await birthControlService.AddBirthControlAsync(request);
        if (created == null)
        {
            return BadRequest("Failed to create birth control record.");
        }
        else
        {
            return Ok(created);
        }
    }
    
    
    [HttpDelete("{Id}")]
    public async Task<IActionResult> RemoveBirthControl(Guid Id)
    {
        var removed = await birthControlService.RemoveBirthControlAsync(Id);

        if (removed)
            return NoContent();
        else
            return NotFound();
    }
    
    
    [HttpPut]
    public async Task<IActionResult> UpdateBirthControl([FromBody] UpdateBirthControlRequest request)
    {
        var updated = await birthControlService.UpdateBirthControlAsync(request);

        if (updated.Success)
            return NoContent();
        else
            return BadRequest();
    }
}