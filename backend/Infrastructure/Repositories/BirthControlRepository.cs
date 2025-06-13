using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class BirthControlRepository(IApplicationDbContext dbContext): IBirthControlRepository
{
    public async Task<bool> AddBirthControlAsync(BirthControl birthControl)
    {
        dbContext.BirthControls.Add(birthControl);
        return await dbContext.SaveChangesAsync().ContinueWith(t => t.Result > 0);
    }

    public async Task<bool> RemoveBirthControlAsync(Guid birthControlId)
    {
        return await dbContext.BirthControls.Where(x => x.AccountId == birthControlId).ExecuteDeleteAsync() >0;
        
    }

    public Task<bool> UpdateBirthControlAsync(Guid birthControlId)
    {
        throw new NotImplementedException();
    }

    public async Task<BirthControl?> GetBirthControlAsync(Guid accountId)
    {
        return await dbContext.BirthControls.Where(b => b.AccountId == accountId).FirstOrDefaultAsync();
        
    }

    public async Task<bool> CheckBirthControlExistsAsync(Guid accountId)
    {
        return await dbContext.BirthControls.AnyAsync(b => b.AccountId == accountId);
    }
}