using Domain.Common.BaseEntities;

namespace Domain.Entities;

/// <summary>
///     Save comments for blog posts
/// </summary>
public class Comment : SoftDeletableEntity
{
    public Guid Id { get; set; }

    public string Content { get; set; } = null!;

    public Guid BlogId { get; set; }

    public Guid AccountId { get; set; }

    public Account Account { get; set; } = null!;

    public Blog Blog { get; set; } = null!;

    public Account? CreatedByNavigation { get; set; }

    public Account? DeletedByNavigation { get; set; }

    public Account? UpdatedByNavigation { get; set; }
}