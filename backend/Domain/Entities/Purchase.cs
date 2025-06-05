namespace Domain.Entities;

public class Purchase
{
    public Guid Id { get; set; }

    public Guid AccountId { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Guid? UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public Account Account { get; set; } = null!;

    public ICollection<OrderDetail> OrderDetails { get; set; } = [];

    public PaymentHistory? PaymentHistory { get; set; }
}