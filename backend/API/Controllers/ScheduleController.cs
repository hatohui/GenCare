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
    [Authorize(Roles = $"{RoleNames.Manager}")]
    public async Task<IActionResult> CreateSchedule([FromBody] ScheduleCreateRequest request)
    {
        await scheduleService.AddScheduleAsync(request);
        return Created();
    }
}
