
using Application.DTOs.Feedback;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;
public class FeedbackService(IFeedbackRepository feedbackRepository,
    IAccountRepository accountRepository,
    IServiceRepository serviceRepository) : IFeedbackService
{
    public async Task AddFeedbackAsync(FeedbackCreateRequest request, string accountId)
    {
        Account account = await accountRepository.GetAccountByIdAsync(Guid.Parse(accountId))
            ?? throw new AppException(404, "Account not found");
        Service service = await serviceRepository.SearchServiceByIdAsync(Guid.Parse(request.ServiceId))
            ?? throw new AppException(404, "Service not found");

        Feedback feedback = new()
        {
            Detail = request.Detail,
            Rating = request.Rating,
            CreatedAt = DateTime.Now,
            Service = service,
            CreatedBy = account.Id
        };
        await feedbackRepository.Add(feedback);
    }
}
