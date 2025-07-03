using Application.DTOs.Purchase.Request;
using Application.Helpers;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

/// <summary>
/// handles purchase-related actions such as booking services.
/// </summary>
/// <param name="purchaseService">The Purchase Service</param>
[ApiController]
[Route("api/purchases")]
public class PurchaseController(IPurchaseService purchaseService) : ControllerBase
{
    /// <summary>
    /// Handles booking a service by a member.
    /// </summary>
    /// <param name="request">The member request details</param>
    /// <returns>An Action result containing message</returns>
    /// <response code="200">Service booked successfully.</response>
    /// <response code="401">Unauthorized if the user is not a member.</response>
    [HttpPost]
    [Authorize(Roles = $"{RoleNames.Member},{RoleNames.Admin}")]
    public async Task<IActionResult> BookingServiceAsync([FromBody] BookingServiceRequest request)
    {
        // get access token from header
        // Authorization: Bearer {access_token}
        var accessToken = AuthHelper.GetAccessToken(HttpContext);

        var response = await purchaseService.AddPurchaseAsync(request, accessToken);
        return Ok(response);
    }

    [HttpGet]
    [Authorize(Roles = $"{RoleNames.Member},{RoleNames.Admin}")]
    public async Task<IActionResult> GetBookedServiceAsync()
    {   
        //get access token
        var accessToken = AuthHelper.GetAccessToken(HttpContext);
        //extract account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken);
        var response = await purchaseService.GetBookedService(accountId.ToString("D"));
        return Ok(response);
    }
    [HttpGet("staff/{accountId}")]
    [Authorize(Roles = $"{RoleNames.Staff},{RoleNames.Admin}")]
    public async Task<IActionResult> GetBookedServicesForStaffAsync(Guid accountId, [FromQuery] string? search,[FromQuery] bool? isPaid)
    {
        var response = await purchaseService.GetBookedServicesForStaffAsync(accountId, search,isPaid);
        return Ok(response);
    }
    
}