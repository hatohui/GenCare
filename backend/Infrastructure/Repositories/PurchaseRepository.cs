using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class PurchaseRepository(IApplicationDbContext dbContext) : IPurchaseRepository
{
    public async Task AddAsync(Purchase purchase)
    {
        await dbContext.Purchases.AddAsync(purchase);
        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Purchase purchase)
    {
        dbContext.Purchases.Remove(purchase);
        await dbContext.SaveChangesAsync();
    }

    public async Task<List<Purchase>> GetAllAsync()
    {
        throw new NotImplementedException();
    }


    public async Task<List<Purchase>> GetByAccountId(Guid accountId)
    {
        return await dbContext.Purchases
            .Include(p => p.OrderDetails)
            .Where(p => Guid.Equals(p.AccountId, accountId))
            .ToListAsync();
    }

    public async Task<Purchase?> GetById(Guid id)
    {
        return await dbContext.Purchases
            .Include(p => p.OrderDetails)
            .FirstOrDefaultAsync(p => Guid.Equals(p.Id, id));
    }

    public async Task Update(Purchase purchase)
    {
        dbContext.Purchases.Update(purchase);
        await dbContext.SaveChangesAsync();
    }
}