using Domain.Entities;

namespace Application.Repositories;

public interface ITestTrackerRepository
{
    Task<Result?> ViewTestTrackerAsync(Guid orderDetailId);

    Task<bool> UpdateTestTrackerAsync(Result result);

    Task<bool> DeleteTestTrackerAsync(Guid orderDetailId);

    Task<bool> CheckTestTrackerExistsAsync(Guid orderDetailId);
}