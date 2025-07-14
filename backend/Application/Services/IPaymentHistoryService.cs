using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Payment;
using Domain.Entities;

namespace Application.Services;
public interface IPaymentHistoryService
{
    Task CreatePaymentHistoryAsync(PaymentHistoryModel paymentHistory);
    Task<List<PaymentHistory>> GetAllPaymentHistoriesAsync();

    Task<PaymentHistory?> GetPaymentHistoryById(Guid purchaseId);

    Task UpdatePaymentHistoryAsync(PaymentHistory paymentHistory);

    Task<PaymentHistory?> GetPaymentHistoryByPayId(Guid payId);
}
