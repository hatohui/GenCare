using Application.Services;
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

    [HttpGet("dashboard")]
    [Authorize(Roles = $"{RoleNames.Admin}")]
    public async Task<IActionResult> GetDashboardStatistic()
    {
        var response = await statisticService.GetDashboardStatistic();
        return Ok(response);
    }

    [HttpGet("revenue-data")]
    [Authorize(Roles = $"{RoleNames.Admin}")]
    public async Task<IActionResult> GetRevenue()
    {
        var response = await statisticService.GetDailyRevenueAsync();
        return Ok(response);
    }

    [HttpGet("user-growth")]
    [Authorize(Roles = $"{RoleNames.Admin}")]
    public async Task<IActionResult> GetUserGrowth()
    {
        var response = await statisticService.GetDailyUserGrowth();
        return Ok(response);
    }

    [HttpGet("top-services")]
    [Authorize(Roles = $"{RoleNames.Admin}")]
    public async Task<IActionResult> GetTopServices()
    {
        var response = await statisticService.GetServiceStatistic();
        return Ok(response);
    }

    [HttpGet("payment")]
    [Authorize(Roles = $"{RoleNames.Admin}")]
    public async Task<IActionResult> GetPayment()
    {
        var response = await statisticService.GetPaymentStatistic();
        return Ok(response);
    }

    [HttpGet("users")]
    [Authorize(Roles = $"{RoleNames.Admin}")]
    public async Task<IActionResult> GetUsers()
    {
        var response = await statisticService.GetUserStatistic();
        return Ok(response);
    }
}
