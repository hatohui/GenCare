using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Conversation.Request;

public class InitConversationWithMessage
{
    public Guid MemberId { get; set; }
    [Required] public string FirstMessage { get; set; } = null!;
    public List<string>? MediaUrls { get; set; }
}