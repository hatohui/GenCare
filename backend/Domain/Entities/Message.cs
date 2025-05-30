namespace Domain.Entities;

public class Message
{
    public Guid Id { get; set; }

    public Guid ConversationId { get; set; }

    public Guid CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid? UpdateBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string Content { get; set; } = null!;

    public Conversation Conversation { get; set; } = null!;
}