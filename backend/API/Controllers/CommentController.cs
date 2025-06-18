using Application.DTOs.Comment.Request;
using Application.Helpers;
using Application.Services;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;
[Route("api/comments")]
[ApiController]
public class CommentController(ICommentService commentService) : ControllerBase
{
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateCommentAsync([FromBody] CommentCreateRequest request)
    {
        //get access token
        var access = AuthHelper.GetAccessToken(HttpContext);
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(access);
        //check if accountId is null or empty
        if (string.IsNullOrEmpty(accountId.ToString("D")))
        {
            return Unauthorized("Access token is required.");
        }
        //create comment
        await commentService.CreateCommentAsync(request, accountId.ToString("D"));
        return Created();
    }
}
