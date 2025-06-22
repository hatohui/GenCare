using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Payment;
using Application.Repositories;
using Application.Services;
using Domain.Entities;

namespace Infrastructure.Services;
public class PaymentHistoryService(IPaymentHistoryRepository paymentHistoryRepository) : IPaymentHistoryService
{
    public async Task CreatePaymentHistoryAsync(PaymentHistoryModel model)
    {
        PaymentHistory payment = new()
        {
            PurchaseId = Guid.Parse(model.PurchaseId),
            TransactionId = Guid.Parse(model.TransactionId),
            CreatedAt = DateTime.Now,
            Amount = model.Amount,
            ExpiredAt = null // Assuming no expiration for the payment history
        };
        await paymentHistoryRepository.Add(payment);
    }
}
