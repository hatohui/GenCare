using Application.DTOs.Message.Request;
using Application.DTOs.Message.Response;

namespace Application.Services;

public interface IMessageService
{
    
    Task<MessageResponse> CreateMessageAsync(MessageCreateRequest request);
    Task<List<MessageResponse>> GetMessagesByConversationIdAsync(Guid conversationId);
    
}