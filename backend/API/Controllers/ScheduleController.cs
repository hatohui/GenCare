using Application.DTOs.Schedule.Request;
using Application.Helpers;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
[Route("api/schedules")]
[ApiController]
public class ScheduleController(IScheduleService scheduleService) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = $"{RoleNames.Manager},{RoleNames.Admin}")]
    public async Task<IActionResult> CreateSchedule([FromBody] ScheduleCreateRequest request)
    {
        await scheduleService.AddScheduleAsync(request);
        return Created(); //201
    }

    [HttpPut]
    [Authorize(Roles = $"{RoleNames.Manager},{RoleNames.Admin}")]
    public async Task<IActionResult> UpdateSchedule([FromBody] ScheduleUpdateRequest request)
    {
        await scheduleService.UpdateScheduleAsync(request);
        return NoContent(); //204 
    }

    [HttpDelete("{scheduleId}")]
    [Authorize(Roles = $"{RoleNames.Manager},{RoleNames.Admin}")]
    public async Task<IActionResult> DeleteSchedule([FromRoute] string scheduleId)
    {
        await scheduleService.DeleteScheduleAsync(scheduleId);
        return NoContent(); //204
    }

    [HttpGet("{id}")]
    [Authorize(Roles = $"{RoleNames.Manager},{RoleNames.Admin},{RoleNames.Staff},{RoleNames.Consultant}")]
    public async Task<IActionResult> GetSchedule([FromRoute] string id, [FromQuery] DateTime? startAt, [FromQuery] DateTime? endAt)
    {
        //get access token from header
        string accessToken = AuthHelper.GetAccessToken(HttpContext);
        var response = await scheduleService.GetScheduleAsync(accessToken, id, startAt, endAt);
        return Ok(response);
    }

    [HttpGet]
    [Authorize(Roles = $"{RoleNames.Manager},{RoleNames.Admin}")]
    public async Task<IActionResult> GetAllSchedule([FromQuery] DateTime? startAt, [FromQuery] DateTime? endAt)
    {
        var response = await scheduleService.GetAllScheduleAsync(startAt, endAt);
        return Ok(response);
    }
}
