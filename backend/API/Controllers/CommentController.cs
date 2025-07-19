using Application.DTOs.Comment.Request;
using Application.Helpers;
using Application.Services;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;
/// <summary>
/// Controller for managing comment operations.
/// </summary>
[Route("api/comments")]
[ApiController]
public class CommentController(ICommentService commentService) : ControllerBase
{
    /// <summary>
    /// Creates a new comment for a blog post.
    /// </summary>
    /// <param name="request">The comment creation request data.</param>
    /// <returns>A response indicating the result of the creation operation.</returns>
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

    /// <summary>
    /// Retrieves all comments for a specific blog post.
    /// </summary>
    /// <param name="blogId">The ID of the blog post.</param>
    /// <returns>A list of comments for the specified blog post.</returns>
    [HttpGet]
    public async Task<IActionResult> GetComments([FromQuery] string blogId)
    {
        //check if blogId is null or empty
        if (string.IsNullOrEmpty(blogId))
        {
            return BadRequest("BlogId is required.");
        }
        //get comments
        var comments = await commentService.GetCommentAsync(blogId);
        return Ok(comments);
    }

    /// <summary>
    /// Updates an existing comment.
    /// </summary>
    /// <param name="request">The comment update request data.</param>
    /// <param name="id">The ID of the comment to update.</param>
    /// <returns>A response indicating the result of the update operation.</returns>
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateComment([FromBody] CommentUpdateRequest request, [FromRoute] string id)
    {
        if (string.IsNullOrEmpty(id))
        {
            return BadRequest("CommentId is required.");
        }
        //get access token
        var access = AuthHelper.GetAccessToken(HttpContext);
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(access);

        await commentService.UpdateCommentAsync(request, id, accountId.ToString("D"));
        return NoContent();
    }

    /// <summary>
    /// Deletes a comment.
    /// </summary>
    /// <param name="id">The ID of the comment to delete.</param>
    /// <returns>A response indicating the result of the delete operation.</returns>
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteComment([FromRoute] string id)
    {
        if (string.IsNullOrEmpty(id))
        {
            return BadRequest("CommentId is required.");
        }
        //get access token
        var access = AuthHelper.GetAccessToken(HttpContext);
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(access);
        await commentService.DeleteCommentAsync(id, accountId.ToString("D"));
        return NoContent();
    }
    [HttpPost("{id}/like")]
    public async Task<IActionResult> LikeComment([FromRoute] Guid id)
    {
        
        //get access token
        var access = AuthHelper.GetAccessToken(HttpContext);
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(access);
        await commentService.LikeCommentAsync(id, accountId.ToString("D"));
        return NoContent();
    }
}