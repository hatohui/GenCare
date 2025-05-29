namespace Domain.Entities;

/// <summary>
/// Table for storing blog posts
/// </summary>
public   class Blog
{
    public Guid Id { get; set; }

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public string Author { get; set; } = null!;

    public DateTime? PublishedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Guid? UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Guid? DeletedBy { get; set; }

    public   ICollection<BlogTag> BlogTag { get; set; } = [];

    public   ICollection<Comment> Comment { get; set; } = [];
}