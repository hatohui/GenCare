using Application.DTOs.Conversation.Request;
using Domain.Entities;

namespace Application.Services;

public interface IConversationService
{
    Task<Conversation?> CreateConversationAsync(CreateConversationRequest request);
    Task<bool> JoinConversationAsync(JoinConversationRequest request);
    Task<bool> EndConversationAsync(Guid conversationId);
    Task<List<Conversation>> GetPendingConversationsAsync(); 
}
    
