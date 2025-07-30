using Application.Repositories;
using Domain.Abstractions;
using Domain.Common.Constants;
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

    public async Task<List<Purchase>> GetAllPurchasesAsync()
        => await dbContext.Purchases
                 .Include(p => p.OrderDetails)
                    .ToListAsync();


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

    public async Task RemoveUnpaidPurchasesAsync()
    {
        var oneWeekAgo = DateTime.SpecifyKind(DateTime.Now.AddDays(-7), DateTimeKind.Unspecified);

        await dbContext.PaymentHistories
            .Where(ph => ph.Status == PaymentStatus.Pending &&
                dbContext.Purchases
                    .Where(p => p.CreatedAt < oneWeekAgo)
                    .Select(p => p.Id)
                    .Contains(ph.PurchaseId))
            .ExecuteDeleteAsync();

        await dbContext.Purchases
            .Where(p => p.CreatedAt < oneWeekAgo &&
                dbContext.PaymentHistories
                    .Where(ph => ph.Status == PaymentStatus.Pending)
                    .Select(ph => ph.PurchaseId)
                    .Contains(p.Id))
            .ExecuteDeleteAsync();
    }
}