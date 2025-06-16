
using Application.DTOs.Feedback;

namespace Application.Services;
public interface IFeedbackService
{
    Task AddFeedbackAsync(FeedbackCreateRequest request, string id);
    Task<List<FeedbackViewByServiceResponse>> GetAllFeedbackByServiceAsync(string serviceId);

    Task UpdateFeedbackAsync(FeedbackUpdateRequest request, string feedbackId, string accountId);
    //Task DeleteFeedbackAsync(string id);
}
