namespace Domain.Entities;

public class Tag
{
    public Guid Id { get; set; }

    public string Title { get; set; } = null!;

    public virtual ICollection<BlogTag> BlogTag { get; set; } = [];
}