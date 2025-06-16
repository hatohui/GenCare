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

    [HttpPatch]
    [Authorize(Roles = "admin,staff")]
    public async Task<IActionResult> UpdateTestResult([FromBody] UpdateTestResultRequest request)
    {
        var response = await testTrackerService.UpdateTestResultAsync(request);

        if (!response.Success)
            return BadRequest(response.Message);

        return NoContent();
    }

    [HttpDelete("{orderDetailId}")]
    [Authorize(Roles = "admin,staff")]
    public async Task<IActionResult> DeleteTestTracker(Guid orderDetailId)
    {
        var request = new DeleteTestResultRequest
        {
            OrderDetailId = orderDetailId
        };

        var response = await testTrackerService.DeleteTestTrackerAsync(request);

        if (!response.Success)
            return BadRequest(response.Message);

        return NoContent();
    }
}