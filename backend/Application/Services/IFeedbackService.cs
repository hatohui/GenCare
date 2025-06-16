
using Application.DTOs.Feedback;

namespace Application.Services;
public interface IFeedbackService
{
    Task AddFeedbackAsync(FeedbackCreateRequest request, string id);
    Task<List<FeedbackViewByServiceResponse>> GetAllFeedbackByServiceAsync(string serviceId);
    //Task<FeedbackDto?> GetFeedbackByIdAsync(string id);
    //Task UpdateFeedbackAsync(string id, string detail, int rating);
    //Task DeleteFeedbackAsync(string id);
}
