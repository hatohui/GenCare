using Application.DTOs.Message.Request;
using Application.DTOs.Message.Response;

namespace Application.Services;

public interface IMessageService
{
    
    Task<MessageResponse> CreateMessageAsync(MessageCreateRequest request, string accessToken);
    Task<List<MessageResponse>> GetMessagesByConversationIdAsync(Guid conversationId);
    
    Task<DeleteMessageResponse> DeleteMessageAsync(Guid messageId, string accessToken);
    
}