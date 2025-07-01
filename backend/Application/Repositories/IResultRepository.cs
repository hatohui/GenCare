using Domain.Entities;

namespace Application.Repositories;

public interface IResultRepository
{
    Task<Result?> ViewResultAsync(Guid orderDetailId);

    Task<bool> UpdateResultAsync(Result result);

    Task<bool> DeleteResultAsync(Guid orderDetailId);
    Task<List<Result>> ViewResultListAsync();

    Task<bool> CheckResultExistsAsync(Guid orderDetailId);
    Task AddAsync(Result result);
}