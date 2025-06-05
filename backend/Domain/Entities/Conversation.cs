namespace Domain.Entities;

public class Conversation
{
    public Guid Id { get; set; }

    public Guid StaffId { get; set; }

    public Guid MemberId { get; set; }

    public DateTime? StartAt { get; set; }

    public bool Status { get; set; }

    public Account Member { get; set; } = null!;

    public ICollection<Message> Messages { get; set; } = [];

    public Account Staff { get; set; } = null!;
}