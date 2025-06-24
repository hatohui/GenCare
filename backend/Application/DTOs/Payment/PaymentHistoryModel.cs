using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Payment;
public class PaymentHistoryModel
{
    public string PurchaseId { get; set; } = null!;
    public string TransactionId { get; set; } = null!;
    public decimal Amount { get; set; }
}
