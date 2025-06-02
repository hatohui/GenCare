using Domain.Common.BaseEntities;

namespace Domain.Entities;

public class Service : SoftDeletableEntity
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public ICollection<Feedback> Feedback { get; set; } = [];

    public ICollection<OrderDetail> OrderDetail { get; set; } = [];
}