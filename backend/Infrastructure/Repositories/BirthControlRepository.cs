using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class BirthControlRepository(IApplicationDbContext dbContext): IBirthControlRepository
{
    public Task<bool> AddBirthControlAsync(Guid birthControlId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> RemoveBirthControlAsync(Guid birthControlId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateBirthControlAsync(Guid birthControlId)
    {
        throw new NotImplementedException();
    }

    public async Task<BirthControl?> GetBirthControlAsync(Guid accountId)
    {
        return await dbContext.BirthControls.Where(b => b.AccountId == accountId).FirstOrDefaultAsync();
        
    }
}