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
}
