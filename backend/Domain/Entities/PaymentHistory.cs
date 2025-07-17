
namespace Domain.Entities;

public class PaymentHistory
{
    public Guid PurchaseId { get; set; }
    public string? TransactionId { get; set; }
    public DateTime CreatedAt { get; set; }
    public decimal Amount { get; set; }
    public DateTime? ExpiredAt { get; set; }
    public string Status { get; set; } = null!;
    public string PaymentMethod { get; set; } = null!;
    public Guid? PayId { get; set; }
    public Purchase Purchase { get; set; } = null!;
}