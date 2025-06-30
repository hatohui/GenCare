using Application.DTOs.TestTracker.Request;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[ApiController]
[Route("api/result")]
public class TestTrackerController(ITestTrackerService testTrackerService) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<IActionResult> ViewTestTrackerById(Guid id)
    {
        var accessToken = Request.Headers.Authorization.ToString().Replace("Bearer ", "");

        var result = await testTrackerService.ViewResultAsync(id, accessToken);

        if (result == null)
            return NotFound();

        return Ok(result);
    }
    [HttpPut("{id}")]
    [Authorize(Roles = "admin,staff")]
    public async Task<IActionResult> UpdateTestResult([FromRoute] string id,[FromBody] UpdateTestResultRequest request)
    {
        request.OrderDetailId = id;
        var response = await testTrackerService.UpdateResultAsync(request);

        if (!response.Success)
            return BadRequest(response.Message);

        return NoContent();
    }
    [HttpDelete("{id}")]
    [Authorize(Roles = $"{RoleNames.Admin},{RoleNames.Staff}")]
    public async Task<IActionResult> DeleteTestTracker(Guid id)
    {
        var request = new DeleteTestResultRequest
        {
            OrderDetailId = id
        };

        var response = await testTrackerService.DeleteResultAsync(request);

        if (!response.Success)
            return BadRequest(response.Message);

        return NoContent();
    }

    [HttpGet("all")]
    [Authorize(Roles = $"{RoleNames.Admin},{RoleNames.Staff},{RoleNames.Manager},{RoleNames.Consultant}")]
    public async Task<IActionResult> GetAllBookedOrders()
    {
        var result = await testTrackerService.GetBookedServiceModelAsync();
        return Ok(result);
    }
}