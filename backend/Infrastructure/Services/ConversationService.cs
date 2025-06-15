using Application.DTOs.Conversation.Request;
using Application.Repositories;
using Application.Services;
using Domain.Entities;

namespace Infrastructure.Services;

public class ConversationService(IConversationRepository conversationRepository) : IConversationService
{
    private static DateTime ToUnspecified(DateTime dt)
    {
        return DateTime.SpecifyKind(dt, DateTimeKind.Unspecified);
    }
    public async Task<Conversation?> CreateConversationAsync(CreateConversationRequest request)
    {
        var conversation = new Conversation
        {
            Id = Guid.NewGuid(),
            MemberId = request.MemberId,
            Status = false,
            StartAt = null
        };

        await conversationRepository.AddAsync(conversation);
        return conversation;
    }

    public async Task<bool> JoinConversationAsync(JoinConversationRequest request)
    {
        var conversation = await conversationRepository.GetByIdAsync(request.ConversationId);
        if (conversation == null || conversation.StaffId != Guid.Empty) return false;

        conversation.StaffId = request.StaffId;
        conversation.Status = true;
        conversation.StartAt ??= ToUnspecified(DateTime.UtcNow);
        return await conversationRepository.UpdateAsync(conversation);  
    }

    public async Task<bool> EndConversationAsync(Guid conversationId)
    {
        var conversation = await conversationRepository.GetByIdAsync(conversationId);
        if (conversation == null) return false;

        conversation.Status = false;
        return await conversationRepository.UpdateAsync(conversation);    }

    public async Task<List<Conversation>> GetPendingConversationsAsync() => await conversationRepository.GetPendingConversationsAsync();
    
}