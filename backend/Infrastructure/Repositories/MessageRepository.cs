using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class MessageRepository(IApplicationDbContext dbContext): IMessageRepository
{
    public async Task<Message?> GetByIdAsync(Guid id)
    {
        return await dbContext.Messages
            .Include(m => m.Media)
            .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);
    }

    public async Task<List<Message>> GetAllByConversationIdAsync(Guid conversationId)
    {
        return await dbContext.Messages
            .Where(m => m.ConversationId == conversationId && !m.IsDeleted)
            .Include(m => m.Media)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();
    }

    public async Task AddAsync(Message message)
    {
        await dbContext.Messages.AddAsync(message);
    }

    public async Task UpdateAsync(Message message)
    {
        dbContext.Messages.Update(message);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var message = await dbContext.Messages.FindAsync(id);
        if (message != null)
        {
            message.IsDeleted = true;
            message.DeletedAt = DateTime.UtcNow;
        }
    }

    public async Task SaveChangesAsync() => await dbContext.SaveChangesAsync();
    
}