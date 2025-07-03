using Application.DTOs.Feedback;
using Application.Helpers;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

/// <summary>
/// Controller for managing feedback-related operations.
/// </summary>
[Route("api/feedbacks")]
[ApiController]
public class FeedbackController(IFeedbackService feedbackService) : ControllerBase
{
    /// <summary>
    /// Creates a new feedback entry.
    /// </summary>
    /// <param name="request">The feedback creation request data.</param>
    /// <returns>A <see cref="CreatedResult"/> if the feedback is created successfully.</returns>
    [HttpPost]
    [Authorize(Roles = $"{RoleNames.Member},{RoleNames.Admin}")]
    public async Task<IActionResult> CreateFeedbackAsync([FromBody] FeedbackCreateRequest request)
    {
        //get access token from HttpContext
        var access = AuthHelper.GetAccessToken(HttpContext);
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(access);
        //call service
        await feedbackService.AddFeedbackAsync(request, accountId.ToString("D"));
        return Created();
    }

    /// <summary>
    /// Retrieves all feedback entries for a specific service.
    /// </summary>
    /// <param name="id">The identifier of the service.</param>
    /// <returns>A list of feedbacks for the specified service.</returns>
    [HttpGet("{id}")]
    [Authorize(Roles = $"{RoleNames.Admin}")]

    public async Task<IActionResult> GetAllFeedbackByServiceAsync([FromRoute] string id)
    {
        //call service
        var feedbacks = await feedbackService.GetAllFeedbackByServiceAsync(id);
        return Ok(feedbacks);
    }

    /// <summary>
    /// Updates an existing feedback entry.
    /// </summary>
    /// <param name="id">The identifier of the feedback to update.</param>
    /// <param name="request">The feedback update request data.</param>
    /// <returns>A <see cref="NoContentResult"/> if the update is successful.</returns>
    [HttpPut("{id}")]
    [Authorize(Roles = $"{RoleNames.Member}")]
    public async Task<IActionResult> UpdateFeedbackAsync([FromRoute] string id, [FromBody] FeedbackUpdateRequest request)
    {
        //get access token from HttpContext
        var access = AuthHelper.GetAccessToken(HttpContext);
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(access);
        //call service
        await feedbackService.UpdateFeedbackAsync(request, id, accountId.ToString("D"));
        return NoContent();
    }

    /// <summary>
    /// Deletes a feedback entry.
    /// </summary>
    /// <param name="id">The identifier of the feedback to delete.</param>
    /// <returns>A <see cref="NoContentResult"/> if the deletion is successful.</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = $"{RoleNames.Member},{RoleNames.Admin},{RoleNames.Manager}")]
    public async Task<IActionResult> DeleteFeedbackAsync([FromRoute] string id)
    {
        //get access token from HttpContext
        var access = AuthHelper.GetAccessToken(HttpContext);
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(access);
        //get role from access token
        var role = JwtHelper.GetRoleFromToken(access);
        //call service
        await feedbackService.DeleteFeedbackAsync(id, role, accountId.ToString("D"));
        return NoContent();
    }
}