namespace Domain.Entities;

/// <summary>
/// Table for storing tags for blog posts
/// </summary>
public class Tag
{
    public Guid Id { get; set; }

    public string Title { get; set; } = null!;

    public ICollection<BlogTag> BlogTag { get; set; } = [];
}