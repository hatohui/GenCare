using Application.Repositories;
using Domain.Abstractions;

namespace Infrastructure.Repositories;
public class ReminderRepository(IApplicationDbContext context) : IReminderRepository
{

    public async Task<List<UnpaidPurchaseInfo>> GetUnpaidPurchasesOverDaysAsync(int days, DateTime now)
    {
        var deadline = now.AddDays(-days);

        var result = await (
            from purchase in context.Purchases
            join account in context.Accounts on purchase.AccountId equals account.Id
            join payment in context.PaymentHistories.Where(ph => ph.Status == "paid")
                on purchase.Id equals payment.PurchaseId into paymentGroup
            from payment in paymentGroup.DefaultIfEmpty()
            where purchase.CreatedAt <= deadline
                  && !purchase.IsDeleted
                  && payment == null
            select new UnpaidPurchaseInfo
            {
                PurchaseId = purchase.Id,
                Email = account.Email,
                FirstName = account.FirstName,
                CreatedAt = purchase.CreatedAt
            }
        ).ToListAsync();

        return result;
    }
}