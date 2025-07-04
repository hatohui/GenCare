﻿using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
[Route("api/statistics")]
[ApiController]
public class StatisticController(IStatisticService statisticService) : ControllerBase
{
    [HttpGet("revenue")]
    [Authorize(Roles = $"{RoleNames.Admin}")]
    public async Task<IActionResult> GetPeriodRevenueAsync()
    {
        var response = await statisticService.GetPeriodRevenueAsync();
        return Ok(response);
    }

    [HttpGet("admin")]
    [Authorize(Roles = $"{RoleNames.Admin}")]
    public async Task<IActionResult> GetAdminStatistic()
    {
        var response = await statisticService.GetAdminStatistic();
        return Ok(response);
    }
}
