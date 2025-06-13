using Application.DTOs.BirthControl.Request;
using Application.DTOs.BirthControl.Response;
using Application.Services;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace API.Controllers;

[ApiController]
[Route("api/birthcontrol")]
public class BirthControlController(IBirthControlService birthControlService): ControllerBase
{
    [HttpGet("{id}")]
    public async Task<IActionResult> ViewBirthControlById(Guid id)
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
            return Created();
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
    [HttpDelete("{accountId}")]
    public async Task<IActionResult> RemoveBirthControl(Guid accountId)
    {
        try
        {
            var result = await birthControlService.RemoveBirthControlAsync(accountId);
            if (result)
            {
                return NoContent();
            }
            return NotFound();
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Something went wrong.");
        }
    }
    
}