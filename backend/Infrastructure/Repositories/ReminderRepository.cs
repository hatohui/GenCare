using Application.Repositories;
using Domain.Abstractions;

namespace Infrastructure.Repositories;
public class ReminderRepository(IApplicationDbContext context) : IReminderRepository
{

    public async Task<List<UnpaidPurchaseInfo>> GetUnpaidPurchasesOverDaysAsync(int days)
    {
        var deadline = DateTime.Now.AddDays(-days);

        var result = await context.Purchases
            .Where(purchase =>
                purchase.CreatedAt <= deadline &&
                !purchase.IsDeleted &&
                !context.PaymentHistories.Any(ph => ph.PurchaseId == purchase.Id && ph.Status == "paid")
            )
            .Join(
                context.Accounts,
                purchase => purchase.AccountId,
                account => account.Id,
                (purchase, account) => new UnpaidPurchaseInfo
                {
                    PurchaseId = purchase.Id,
                    Email = account.Email,
                    FirstName = account.FirstName,
                    CreatedAt = purchase.CreatedAt
                }
            )
            .ToListAsync();

        return result;
    }
}