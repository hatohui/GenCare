using Application.Helpers;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;


namespace API.Controllers;
[Route("api/orderDetails")]
[ApiController]
public class OrderDetailController(IOrderDetailService orderDetailService) : ControllerBase
{
    [HttpDelete("{id}")]
    [Authorize(Roles = $"{RoleNames.Member}")]
    public async Task<IActionResult> DeleteOrderDetail([FromRoute] string id)
    {
        //get access token from header
        var accessToken = AuthHelper.GetAccessToken(HttpContext);
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken).ToString("D");
        if (string.IsNullOrEmpty(accountId))
        {
            return Unauthorized("Invalid access token");
        }
        await orderDetailService.DeleteOrderDetail(id, accountId);
        return NoContent();
    }
}
