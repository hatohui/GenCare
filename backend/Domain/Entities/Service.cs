namespace Domain.Entities;

public class Service
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Guid? UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public ICollection<Feedback> Feedbacks { get; set; } = [];

    public ICollection<Media> Media { get; set; } = [];

    public ICollection<OrderDetail> OrderDetails { get; set; } = [];
}