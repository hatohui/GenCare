using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Repositories;
public interface IPaymentHistoryRepository
{
    Task Add(PaymentHistory paymentHistory);
    Task<List<PaymentHistory>> GetAll();
    Task<PaymentHistory?> GetById(Guid id);
    Task Update(PaymentHistory paymentHistory);
    Task Delete(PaymentHistory paymentHistory);
}
