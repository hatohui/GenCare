namespace Domain.Entities;

public class Purchase
{
    public Guid Id { get; set; }

    public Guid AccountId { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Guid? DeletedBy { get; set; }

    public Account Account { get; set; } = null!;

    public ICollection<OrderDetail> OrderDetail { get; set; } = [];

    public PaymentHistory? PaymentHistory { get; set; }
}