using System.ComponentModel.DataAnnotations.Schema;
using Domain.Common.Enums;

namespace Domain.Entities;

public class PaymentHistory
{
    public Guid PurchaseId { get; set; }

    public Guid TransactionId { get; set; }

    public DateTime CreatedAt { get; set; }

    public double Amount { get; set; }

    public DateTime? ExpiredAt { get; set; }

    public Purchase Purchase { get; set; } = null!;

    [Column("status")]
    public PaymentHistoryStatus Status { get; set; }

    [Column("payment_method")]
    public PaymentMethodStatus PaymentMethod { get; set; }
}