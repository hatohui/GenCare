using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Repositories;
using Domain.Abstractions;
using Domain.Common.Constants;
using Domain.Entities;

namespace Infrastructure.Repositories;
public class PaymentHistoryRepository(IApplicationDbContext dbContext) : IPaymentHistoryRepository
{
    public async Task Add(PaymentHistory paymentHistory)
    {
        await dbContext.PaymentHistories.AddAsync(paymentHistory);
        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(PaymentHistory paymentHistory)
    {
        dbContext.PaymentHistories.Remove(paymentHistory);
        await dbContext.SaveChangesAsync();
    }

    public async Task<HashSet<Guid>> GetPaidPurchaseIdsAsync(IEnumerable<Purchase> purchases)
    {
        // Get all purchase IDs from the provided purchases
        var purchaseIds = purchases.Select(p => p.Id).ToList();

        // Query the PaymentHistories to find PurchaseId if the status is 'Paid'
        var paidPurchaseIds = await dbContext.PaymentHistories
            .Where(ph => purchaseIds.Contains(ph.PurchaseId)
                         && ph.Status.Trim().ToLower() == PaymentStatus.Paid.ToLower())
            .Select(ph => ph.PurchaseId)
            .Distinct()
            .ToListAsync();

        return paidPurchaseIds.ToHashSet();

    }

    public async Task<List<PaymentHistory>> GetByPurchaseIdsAsync(List<Guid> purchaseIds)
    {
        return await dbContext.PaymentHistories
            .Where(ph => purchaseIds.Contains(ph.PurchaseId))
            .ToListAsync();
    }


    public async Task<List<PaymentHistory>> GetAll()
    {
        return await dbContext.PaymentHistories
            .ToListAsync();
    }

    public async Task<PaymentHistory?> GetById(Guid id)
    {
        return await dbContext.PaymentHistories
            .FirstOrDefaultAsync(ph => ph.PurchaseId == id);
    }

    public async Task UpdateAsync(PaymentHistory paymentHistory)
    {
        dbContext.PaymentHistories.Update(paymentHistory);
        await dbContext.SaveChangesAsync();
    }
}
