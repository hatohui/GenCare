using Application.DTOs.Feedback;

namespace Application.Services;

/// <summary>
/// Provides methods for managing feedback operations.
/// </summary>
public interface IFeedbackService
{
    /// <summary>
    /// Adds a new feedback entry asynchronously.
    /// </summary>
    /// <param name="request">The feedback creation request data.</param>
    /// <param name="id">The identifier of the account creating the feedback.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task AddFeedbackAsync(FeedbackCreateRequest request, string id);

    /// <summary>
    /// Retrieves all feedback entries for a specific service asynchronously.
    /// </summary>
    /// <param name="serviceId">The identifier of the service.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains a list of feedback responses for the service.
    /// </returns>
    Task<List<FeedbackViewByServiceResponse>> GetAllFeedbackByServiceAsync(string serviceId);

    /// <summary>
    /// Updates an existing feedback entry asynchronously.
    /// </summary>
    /// <param name="request">The feedback update request data.</param>
    /// <param name="feedbackId">The identifier of the feedback to update.</param>
    /// <param name="accountId">The identifier of the account performing the update.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task UpdateFeedbackAsync(FeedbackUpdateRequest request, string feedbackId, string accountId);

    /// <summary>
    /// Deletes a feedback entry asynchronously.
    /// </summary>
    /// <param name="feedbackId">The identifier of the feedback to delete.</param>
    /// <param name="role">The role of the account requesting deletion.</param>
    /// <param name="accountId">The identifier of the account requesting deletion.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task DeleteFeedbackAsync(string feedbackId, string role, string accountId);
}