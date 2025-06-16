using Application.DTOs.Feedback;
using Application.Helpers;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;
[Route("api/feedbacks")]
[ApiController]
public class FeedbackController(IFeedbackService feedbackService) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = $"{RoleNames.Member}")]
    public async Task<IActionResult> CreateFeedbackAsync([FromBody] FeedbackCreateRequest request)
    {
        //get access token from HttpContext
        var access = AuthHelper.GetAccessToken(HttpContext);
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(access);
        //call service
        await feedbackService.AddFeedbackAsync(request, accountId.ToString("D"));
        return Ok();
    }
}
