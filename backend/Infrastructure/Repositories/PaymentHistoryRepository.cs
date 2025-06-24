using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Repositories;
using Domain.Abstractions;
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

    public async Task Update(PaymentHistory paymentHistory)
    {
        dbContext.PaymentHistories.Update(paymentHistory);
        await dbContext.SaveChangesAsync();
    }
}
