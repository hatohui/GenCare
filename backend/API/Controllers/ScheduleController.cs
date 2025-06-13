using Application.DTOs.Schedule.Request;
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
}
