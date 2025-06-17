namespace Application.DTOs.Conversation.Request;

public class JoinConversationRequest
{
    public Guid StaffId { get; set; }
    public Guid ConversationId { get; set; }
    
}