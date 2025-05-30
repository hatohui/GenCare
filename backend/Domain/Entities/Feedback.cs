namespace Domain.Entities;

public class Feedback
{
    public Guid Id { get; set; }

    public string Detail { get; set; } = null!;

    public int Rating { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid ServiceId { get; set; }

    public Service Service { get; set; } = null!;
}