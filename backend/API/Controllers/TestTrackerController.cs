using Application.DTOs.Result.Request;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[ApiController]
[Route("api/result")]
public class TestTrackerController(IResultService resultService) : ControllerBase
{
    [HttpGet("{id}")]

    public async Task<IActionResult> ViewTestTrackerById(Guid id)
    {
        var accessToken = Request.Headers.Authorization.ToString().Replace("Bearer ", "");

        var result = await resultService.ViewResultAsync(id, accessToken);

        if (result == null)
            return NotFound();

        return Ok(result);
    }
    [HttpPut("{id}")]
    [Authorize(Roles = $"{RoleNames.Admin},{RoleNames.Staff}")]
    public async Task<IActionResult> UpdateTestResult([FromRoute] Guid id,[FromBody] UpdateTestResultRequest request)
    {
        var response = await resultService.UpdateResultAsync(request, id);

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

        var response = await resultService.DeleteResultAsync(request);

        if (!response.Success)
            return BadRequest(response.Message);

        return NoContent();
    }

    [HttpGet("all")]
    [Authorize(Roles = $"{RoleNames.Admin},{RoleNames.Staff},{RoleNames.Manager},{RoleNames.Consultant}")]
    public async Task<IActionResult> GetAllBookedOrders(
        [FromQuery] int? page,
        [FromQuery] int? count,
        [FromQuery] string? orderDetailId)
    {
        var currentPage = page.GetValueOrDefault(1);
        var pageSize = count.GetValueOrDefault(10);

        var result = await resultService.GetBookedServiceModelAsync(currentPage, pageSize, orderDetailId);
        return Ok(result);
    }

}