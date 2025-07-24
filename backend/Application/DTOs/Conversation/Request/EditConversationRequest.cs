namespace Application.DTOs.Conversation.Request;

public class EditConversationRequest
{
    //public Guid ConversationId { get; set; }
    public Guid StaffId { get; set; }
    public Guid MemberId { get; set; }
    public DateTime? StartAt { get; set; }
    public bool Status { get; set; }
}