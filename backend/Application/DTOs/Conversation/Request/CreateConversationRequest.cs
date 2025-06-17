namespace Application.DTOs.Conversation.Request;

public class CreateConversationRequest
{
    public Guid MemberId { get; set; }
    public Guid StaffId { get; set; }
}