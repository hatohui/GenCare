namespace Domain.Entities;

public class Tag
{
    public Guid Id { get; set; }

    public string Title { get; set; } = null!;

    public ICollection<BlogTag> BlogTags { get; set; } = [];
}