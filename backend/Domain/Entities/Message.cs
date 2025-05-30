using Domain.Common.BaseEntities;

namespace Domain.Entities;

public class Message : SoftDeletableEntity
{
    public Guid Id { get; set; }

    public Guid ConversationId { get; set; }

    public string Content { get; set; } = null!;

    public Conversation Conversation { get; set; } = null!;
}