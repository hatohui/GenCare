using Application.Helpers;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
[Route("api/orderDetails")]
[ApiController]
public class OrderDetailController(IOrderDetailService orderDetailService) : ControllerBase
{
    [HttpDelete("{id}")]
    [Authorize(Roles = $"{RoleNames.Member}, {RoleNames.Admin}")]
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
