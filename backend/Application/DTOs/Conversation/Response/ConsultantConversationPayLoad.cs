namespace Application.DTOs.Conversation.Response;

public class ConsultantConversationPayLoad
{
    public Guid ConversationId { get; set; }
    public Guid? StaffId { get; set; }
    public Guid MemberId { get; set; }
    public DateTime? StartAt { get; set; }
    public bool Status { get; set; }
    public string? MemberName { get; set; }
    public string? MemberAvatarUrl { get; set; }
}
