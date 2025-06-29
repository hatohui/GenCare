using Domain.Entities;

namespace Application.Repositories;

public interface IMessageRepository
{
    Task<Message?> GetMessageByIdAsync(Guid id);
    Task<List<Message>> GetAllByConversationIdAsync(Guid conversationId);
    Task AddAsync(Message message);
    Task UpdateAsync(Message message);
    Task DeleteAsync(Guid id);
    Task SaveChangesAsync();
}