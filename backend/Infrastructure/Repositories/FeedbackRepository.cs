using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class FeedbackRepository(IApplicationDbContext dbContext) : IFeedbackRepository
{
    public async Task Add(Feedback feedback)
    {
        await dbContext.Feedbacks.AddAsync(feedback);
        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Feedback feedback)
    {
        dbContext.Feedbacks.Remove(feedback);
        await dbContext.SaveChangesAsync();
    }

    public async Task<List<Feedback>> GetAll()
    {
        return await dbContext.Feedbacks
            .Include(f => f.Service)
            .ToListAsync();
    }

    public async Task<Feedback?> GetById(string id)
    {
        Guid gId = Guid.Parse(id);
        return await dbContext.Feedbacks
            .Include(f => f.Service)
            .FirstOrDefaultAsync(f => Guid.Equals(f.Id, gId));
    }

    public async Task Update(Feedback feedback)
    {
        dbContext.Feedbacks.Update(feedback);
        await dbContext.SaveChangesAsync();
    }
}