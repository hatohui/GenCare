namespace Domain.Entities;

/// <summary>
/// Save comments for blog posts
/// </summary>
public class Comment
{
    public Guid Id { get; set; }

    public string Content { get; set; } = null!;

    public Guid BlogId { get; set; }

    public Guid AccountId { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Guid? UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Guid? DeletedBy { get; set; }

    public Account Account { get; set; } = null!;

    public Blog Blog { get; set; } = null!;

    public Account? CreatedByNavigation { get; set; }

    public Account? DeletedByNavigation { get; set; }

    public Account? UpdatedByNavigation { get; set; }
}