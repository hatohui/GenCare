using Application.DTOs.TestTracker.Request;
using Application.Services;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[ApiController]
[Route("api/result")]
public class TestTrackerController(ITestTrackerService testTrackerService) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<IActionResult> ViewTestTrackerById(Guid id)
    {
        var result = await testTrackerService.ViewTestResultAsync(id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }
    [HttpPut("{id}")]
    [Authorize(Roles = "admin,staff")]
    public async Task<IActionResult> UpdateTestResult([FromRoute] string id,[FromBody] UpdateTestResultRequest request)
    {
         request.OrderDetailId = id;
        var response = await testTrackerService.UpdateTestResultAsync(request);

        if (!response.Success)
            return BadRequest(response.Message);

        return NoContent();
    }
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,staff")]
    public async Task<IActionResult> DeleteTestTracker(Guid id)
    {
        var request = new DeleteTestResultRequest
        {
            OrderDetailId = id
        };

        var response = await testTrackerService.DeleteTestTrackerAsync(request);

        if (!response.Success)
            return BadRequest(response.Message);

        return NoContent();
    }
}