using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class TestTrackerRepository(IApplicationDbContext dbContext) : ITestTrackerRepository
{
    public async Task<Result?> ViewTestTrackerAsync(Guid orderDetailId)
    {
        return await dbContext.Results
            .Where(t => t.OrderDetailId == orderDetailId)
            .FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateTestTrackerAsync(Result result)
    {
        dbContext.Results.Update(result);
        await dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteTestTrackerAsync(Guid orderDetailId)
    {
        return await dbContext.Results
            .Where(t => t.OrderDetailId == orderDetailId)
            .ExecuteDeleteAsync() > 0;
    }

    public async Task<bool> CheckTestTrackerExistsAsync(Guid orderDetailId)
    {
        return await dbContext.Results
            .AnyAsync(t => t.OrderDetailId == orderDetailId);
    }
}