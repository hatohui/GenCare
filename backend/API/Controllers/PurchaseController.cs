using Application.DTOs.Purchase.Request;
using Application.Helpers;
using Application.Services;

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
    [HttpPost("booking")]
    public async Task<IActionResult> BookingServiceAsync([FromBody] BookingServiceRequest request)
    {
        // get access token from header
        // Authorization: Bearer {access_token}
        var accessToken = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

        //get role name from access token
        var roleName = JwtHelper.GetRoleFromAccessToken(accessToken);
        // check if role is not member
        //IActionResult: Unauthorized, BadRequest, Ok, NotFound, etc.
        if (roleName.ToLower() != "member")
        {
            return Unauthorized("You are not a member to book a service.");
            //Unauthorized: 401 Unauthorized
        }

        var response = await purchaseService.AddPurchaseAsync(request, accessToken);
        return Ok(response);
    }
}