using Application.DTOs.Conversation.Request;
using Application.DTOs.Conversation.Response;
using Domain.Entities;

namespace Application.Services;

public interface IConversationService
{
    Task<CreateConversationResponse> CreateConversationAsync(CreateConversationRequest request);
    Task<ViewConversationResponse> ViewConversationAsync(Guid conversationId);
    Task<bool> EndConversationAsync(Guid conversationId);
    Task<List<Conversation>> GetPendingConversationsAsync();
    Task<ViewAllConversationResponse> ViewAllConversationAsync();
    Task<EditConversationResponse> EditConversationAsync(EditConversationRequest request, Guid conversationId);

    Task<bool> AssignStaffToConversationAsync(Guid conversationId, Guid staffId);

    Task<InitConversationResponse> InitConversationWithMessageAsync(InitConversationWithMessage request,
        string accessToken);
}
    
