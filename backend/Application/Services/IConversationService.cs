using Application.DTOs.Conversation.Request;
using Application.DTOs.Conversation.Response;
using Domain.Entities;

namespace Application.Services;

public interface IConversationService
{
    Task<CreateConversationResponse> CreateConversationAsync(CreateConversationRequest request);
    Task<ViewConversationResponse> ViewConversationAsync(ViewConversationRequest request);
    Task<bool> EndConversationAsync(Guid conversationId);
    Task<List<Conversation>> GetPendingConversationsAsync();

    Task<EditConversationResponse> EditConversationAsync(EditConversationRequest request);
}
    
