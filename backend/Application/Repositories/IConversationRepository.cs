using Domain.Entities;

namespace Application.Repositories;

public interface IConversationRepository
{
    Task AddAsync(Conversation conversation);
    Task<Conversation?> GetByIdAsync(Guid id);
    Task<bool> UpdateAsync(Conversation conversation);
    Task<List<Conversation>> GetPendingConversationsAsync();
}