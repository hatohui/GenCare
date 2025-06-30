using Domain.Entities;

namespace Application.Repositories;

public interface ITestTrackerRepository
{
    Task<Result?> ViewResultAsync(Guid orderDetailId);

    Task<bool> UpdateResultAsync(Result result);

    Task<bool> DeleteResultAsync(Guid orderDetailId);

    Task<bool> CheckResultExistsAsync(Guid orderDetailId);
    Task AddAsync(Result result);
}