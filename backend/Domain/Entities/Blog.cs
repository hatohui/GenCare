using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

public class Blog
{
    public Guid Id { get; set; }
    [Column("likes")]
    public int Likes { get; set; }
    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public string Author { get; set; } = null!;

    public DateTime? PublishedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Guid? UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public ICollection<BlogTag> BlogTags { get; set; } = [];

    public ICollection<Comment> Comments { get; set; } = [];

    public ICollection<Media> Media { get; set; } = [];
}