using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Payment;
using Application.Repositories;
using Application.Services;
using Domain.Common.Enums;
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
            TransactionId = Guid.Parse(model.TransactionId),
            CreatedAt = DateTime.Now,
            Amount = model.Amount,
            ExpiredAt = null, // Assuming no expiration for the payment history
            Status = PaymentHistoryStatus.Paid,
            PaymentMethod = PaymentMethodStatus.Momo
        };
        await paymentHistoryRepository.Add(payment);
    }

    public async Task<List<PaymentHistory>> GetAllPaymentHistoriesAsync()
    {
        return await paymentHistoryRepository.GetAll();
    }
}
