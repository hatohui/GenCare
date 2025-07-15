namespace Application.DTOs.Conversation.Request;

public class InitConversationWithMessage
{
    public Guid MemberId { get; set; }
    public string? FirstMessage { get; set; }
    public List<string>? MediaUrls { get; set; }
}