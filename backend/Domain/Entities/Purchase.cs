using Domain.Common.BaseEntities;

namespace Domain.Entities;

public class Purchase : SoftDeletableEntity
{
    public Guid Id { get; set; }

    public Guid AccountId { get; set; }

    public Account Account { get; set; } = null!;

    public ICollection<OrderDetail> OrderDetail { get; set; } = [];

    public PaymentHistory? PaymentHistory { get; set; }
}