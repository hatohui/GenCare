using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class ConversationRepository(IApplicationDbContext dbContext) : IConversationRepository
{
    public async Task AddAsync(Conversation conversation)
    {
        dbContext.Conversations.Add(conversation);
        await dbContext.SaveChangesAsync();
    }

    public async Task<Conversation?> GetByIdAsync(Guid id)
                 =>await dbContext.Conversations
                         .Include(c => c.Member)
                            .Include(c => c.Staff)
                                .FirstOrDefaultAsync(c => c.Id == id);
    

    public async Task<bool> UpdateAsync(Conversation conversation)
    {
        dbContext.Conversations.Update(conversation);
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<List<Conversation>> GetPendingConversationsAsync()
                    => await dbContext.Conversations
                            .Where(c => c.StaffId == Guid.Empty && !c.Status)
                                 .Include(c => c.Member)
                                     .ToListAsync();
}