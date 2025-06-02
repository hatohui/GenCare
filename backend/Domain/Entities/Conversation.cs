namespace Domain.Entities;

public class Conversation
{
    public Guid Id { get; set; }

    public Guid StaffId { get; set; }

    public Guid MemberId { get; set; }

    public DateTime? StartAt { get; set; }

    public bool Status { get; set; }

    public virtual Account Member { get; set; } = null!;

    public virtual ICollection<Message> Message { get; set; } = [];

    public virtual Account Staff { get; set; } = null!;
}