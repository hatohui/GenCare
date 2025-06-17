using Domain.Entities;

namespace Application.Repositories;

public interface IConversationRepository
{
    Task<bool> AddAsync(Conversation conversation);
    Task<Conversation> GetByIdAsync(Guid conversationId);
    Task<bool> UpdateAsync(Conversation conversation);
    Task<List<Conversation>> GetAllAsync();
    Task<List<Conversation>> GetPendingConversationsAsync();
}