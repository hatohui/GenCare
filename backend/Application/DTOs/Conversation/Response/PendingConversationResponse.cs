namespace Application.DTOs.Conversation.Response;

public class PendingConversationResponse
{
    public Guid ConversationId { get; set; }
    public Guid MemberId { get; set; }
    public string? MemberFirstName { get; set; }
    public string? MemberLastName { get; set; }
    public string? MemberEmail { get; set; }
    public string? MemberName { get; set; }
    public string? MemberAvatarUrl { get; set; }
    public DateTime? StartAt { get; set; }
    public bool Status { get; set; }
}

public class PendingConversationsListResponse
{
    public List<PendingConversationResponse> Conversations { get; set; } = new();
    public int TotalCount { get; set; }
}
