namespace Application.DTOs.Message.Request;

public class MessageCreateRequest
{
    public string ConversationId { get; set; }
    
    public string Content { get; set; } = null!;
    
    public List<string>? MediaUrls { get; set; } = [];
    
    
}