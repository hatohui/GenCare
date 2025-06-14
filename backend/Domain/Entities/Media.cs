namespace Domain.Entities;

public class Media
{
    public Guid Id { get; set; }

    public string Url { get; set; } = null!;

    public string? Type { get; set; }

    public string? Description { get; set; }

    public Guid? MessageId { get; set; }

    public Guid? BlogId { get; set; }

    public Guid? ServiceId { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Guid? UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public Blog? Blog { get; set; }

    public Message? Message { get; set; }

    public Service? Service { get; set; }
}