using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class ResultRepository(IApplicationDbContext dbContext) : IResultRepository
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

    public async Task<List<Result>> ViewResultListAsync()
    {
        return await dbContext.Results
            .ToListAsync();
    }

    public async Task<bool> CheckResultExistsAsync(Guid orderDetailId)
    {
        return await dbContext.Results
            .AnyAsync(t => t.OrderDetailId == orderDetailId);
    }
    public async Task AddAsync(Result result)
    {
        await dbContext.Results.AddAsync(result);
        await dbContext.SaveChangesAsync();
    }
}