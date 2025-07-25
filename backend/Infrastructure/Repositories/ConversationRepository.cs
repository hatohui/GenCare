using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class ConversationRepository(IApplicationDbContext dbContext) : IConversationRepository
{
    public async Task<bool> AddAsync(Conversation conversation)
    {
        await dbContext.Conversations.AddAsync(conversation);
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<Conversation?> GetByIdAsync(Guid id) =>
        await dbContext
            .Conversations.Include(c => c.Member)
            .Include(c => c.Staff)
            .FirstOrDefaultAsync(c => c.Id == id);

    public async Task<bool> UpdateAsync(Conversation conversation)
    {
        dbContext.Conversations.Update(conversation);
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<List<Conversation>> GetPendingConversationsAsync() =>
        await dbContext
            .Conversations.Where(c => c.StaffId == null && !c.Status)
            .AsNoTracking()
            .ToListAsync();

    public async Task<List<Conversation>> GetAllAsync()
    {
        return await dbContext
            .Conversations.Include(c => c.Member)
            .Include(c => c.Staff)
            .ToListAsync();
    }

    public async Task<List<Conversation>> GetConversationsByUserIdAsync(Guid userId) =>
        await dbContext
            .Conversations.Include(c => c.Staff)
            .Where(c => c.MemberId == userId || c.StaffId == userId)
            .OrderByDescending(c => c.StartAt)
            .AsNoTracking()
            .ToListAsync();

    public async Task<List<Conversation>> GetConversationsByStaffIdAsync(Guid staffId) =>
        await dbContext
            .Conversations.Include(c => c.Member)
            .Where(c => c.StaffId == staffId)
            .OrderByDescending(c => c.StartAt)
            .AsNoTracking()
            .ToListAsync();
}
