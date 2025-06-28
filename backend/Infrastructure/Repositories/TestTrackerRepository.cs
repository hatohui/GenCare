using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class TestTrackerRepository(IApplicationDbContext dbContext) : ITestTrackerRepository
{
    public async Task<Result?> ViewResultAsync(Guid orderDetailId)
    {
        return await dbContext.Results
            .Where(t => t.OrderDetailId == orderDetailId)
            .FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateResultAsync(Result result)
    {
        dbContext.Results.Update(result);
        await dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteResultAsync(Guid orderDetailId)
    {
        return await dbContext.Results
            .Where(t => t.OrderDetailId == orderDetailId)
            .ExecuteDeleteAsync() > 0;
    }

    public async Task<bool> CheckResultExistsAsync(Guid orderDetailId)
    {
        return await dbContext.Results
            .AnyAsync(t => t.OrderDetailId == orderDetailId);
    }
}