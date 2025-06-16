using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class ScheduleRepository(IApplicationDbContext dbContext) : IScheduleRepository
{
    public async Task Add(Schedule s)
    {
        await dbContext.Schedules.AddAsync(s);
        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Schedule s)
    {
        dbContext.Schedules.Remove(s);
        await dbContext.SaveChangesAsync();
    }

    public async Task<List<Schedule>> GetAll()
    {
        return await dbContext.Schedules.ToListAsync();
    }

    public async Task<Schedule?> GetById(Guid id)
    {
        return await dbContext.Schedules.Include(s => s.Slot).FirstOrDefaultAsync(s => Guid.Equals(s.Id, id));
    }

    public async Task Update(Schedule s)
    {
        dbContext.Schedules.Update(s);
        await dbContext.SaveChangesAsync();
    }
}