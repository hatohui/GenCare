namespace Application.DTOs.Conversation.Response;

public class InitConversationResponse
{
    public Guid ConversationId { get; set; }
    public Guid MessageId { get; set; }
    public string? Content { get; set; }
    public DateTime CreatedAt { get; set; }
}