using System;
using System.Collections.Generic;

namespace Domain.Entities;

/// <summary>
/// Join table for many-to-many relationship between blogs and tags
/// </summary>
public   class BlogTag
{
    public Guid BlogId { get; set; }

    public Guid TagId { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Guid? UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Guid? DeletedBy { get; set; }

    public   Blog Blog { get; set; } = null!;

    public   Account? CreatedByNavigation { get; set; }

    public   Account? DeletedByNavigation { get; set; }

    public   Tag Tag { get; set; } = null!;

    public   Account? UpdatedByNavigation { get; set; }
}
