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
    [Authorize(Roles = $"{RoleNames.Member}")]
    public async Task<IActionResult> BookingServiceAsync([FromBody] BookingServiceRequest request)
    {
        // get access token from header
        // Authorization: Bearer {access_token}
        var accessToken = AuthHelper.GetAccessToken(HttpContext);

        var response = await purchaseService.AddPurchaseAsync(request, accessToken);
        return Created();
    }
}