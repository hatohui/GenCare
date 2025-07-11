namespace Application.DTOs.Conversation.Response;

public class CreateConversationResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = null!;
    
    public Guid ConversationId { get; set; } 

}