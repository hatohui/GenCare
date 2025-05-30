using Domain.Common.BaseEntities;

namespace Domain.Entities;

/// <summary>
///     Join table for many-to-many relationship between blogs and tags
/// </summary>
public class BlogTag : SoftDeletableEntity
{
    public Guid BlogId { get; set; }

    public Guid TagId { get; set; }

    public Blog Blog { get; set; } = null!;

    public Account? CreatedByNavigation { get; set; }

    public Account? DeletedByNavigation { get; set; }

    public Tag Tag { get; set; } = null!;

    public Account? UpdatedByNavigation { get; set; }
}