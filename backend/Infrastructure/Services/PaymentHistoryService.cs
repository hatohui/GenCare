using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Payment;
using Application.Repositories;
using Application.Services;
using Domain.Common.Constants;
using Domain.Entities;

namespace Infrastructure.Services;
public class PaymentHistoryService(IPaymentHistoryRepository paymentHistoryRepository,
        IPurchaseRepository purchaseRepository) : IPaymentHistoryService
{
    public async Task CreatePaymentHistoryAsync(PaymentHistoryModel model)
    {
        //get purchase by id
        var purchase = await purchaseRepository.GetById(Guid.Parse(model.PurchaseId));
        PaymentHistory payment = new()
        {
            Purchase = purchase!,
            TransactionId = model.TransactionId,
            CreatedAt = DateTime.Now,
            Amount = model.Amount,
            ExpiredAt = null, // Assuming no expiration for the payment history
            Status = PaymentStatus.Paid,
            PaymentMethod = model.PaymentMethod
        };
        await paymentHistoryRepository.Add(payment);
    }

    public async Task<List<PaymentHistory>> GetAllPaymentHistoriesAsync()
    {
        return await paymentHistoryRepository.GetAll();
    }

    public async Task<PaymentHistory?> GetPaymentHistoryById(Guid purchaseId)
    {
        return await paymentHistoryRepository.GetById(purchaseId);
    }

    public async Task<PaymentHistory?> GetPaymentHistoryByPayId(Guid payId)
    {
        var list = await paymentHistoryRepository.GetAll();
        return list.FirstOrDefault(ph => Guid.Equals(ph.PayId, payId));
    }

    public async Task UpdatePaymentHistoryAsync(PaymentHistory paymentHistory)
    {
        await paymentHistoryRepository.Update(paymentHistory);
    }
}
