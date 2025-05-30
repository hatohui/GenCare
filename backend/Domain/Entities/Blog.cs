using Domain.Common.BaseEntities;

namespace Domain.Entities;

/// <summary>
///     Table for storing blog posts
/// </summary>
public class Blog : SoftDeletableEntity
{
    public Guid Id { get; set; }

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public string Author { get; set; } = null!;

    public DateTime? PublishedAt { get; set; }

    public ICollection<BlogTag> BlogTag { get; set; } = [];

    public ICollection<Comment> Comment { get; set; } = [];
}