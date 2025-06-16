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
    [Authorize(Roles = $"{RoleNames.Member}")]
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
    /// <param name="serviceId">The identifier of the service.</param>
    /// <returns>A list of feedbacks for the specified service.</returns>
    [HttpGet("{serviceId}")]
    public async Task<IActionResult> GetAllFeedbackByServiceAsync([FromRoute] string serviceId)
    {
        //call service
        var feedbacks = await feedbackService.GetAllFeedbackByServiceAsync(serviceId);
        return Ok(feedbacks);
    }

    /// <summary>
    /// Updates an existing feedback entry.
    /// </summary>
    /// <param name="feedbackId">The identifier of the feedback to update.</param>
    /// <param name="request">The feedback update request data.</param>
    /// <returns>A <see cref="NoContentResult"/> if the update is successful.</returns>
    [HttpPut("{feedbackId}")]
    [Authorize(Roles = $"{RoleNames.Member}")]
    public async Task<IActionResult> UpdateFeedbackAsync([FromRoute] string feedbackId, [FromBody] FeedbackUpdateRequest request)
    {
        //get access token from HttpContext
        var access = AuthHelper.GetAccessToken(HttpContext);
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(access);
        //call service
        await feedbackService.UpdateFeedbackAsync(request, feedbackId, accountId.ToString("D"));
        return NoContent();
    }

    /// <summary>
    /// Deletes a feedback entry.
    /// </summary>
    /// <param name="feedbackId">The identifier of the feedback to delete.</param>
    /// <returns>A <see cref="NoContentResult"/> if the deletion is successful.</returns>
    [HttpDelete("{feedbackId}")]
    [Authorize(Roles = $"{RoleNames.Member},{RoleNames.Admin},{RoleNames.Manager}")]
    public async Task<IActionResult> DeleteFeedbackAsync([FromRoute] string feedbackId)
    {
        //get access token from HttpContext
        var access = AuthHelper.GetAccessToken(HttpContext);
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(access);
        //get role from access token
        var role = JwtHelper.GetRoleFromToken(access);
        //call service
        await feedbackService.DeleteFeedbackAsync(feedbackId, role, accountId.ToString("D"));
        return NoContent();
    }
}