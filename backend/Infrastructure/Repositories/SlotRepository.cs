using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class SlotRepository(IApplicationDbContext dbContext) : ISlotRepository
{
    public async Task Add(Slot s)
    {
        await dbContext.Slots.AddAsync(s);
        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Slot s)
    {
        var slot = await dbContext.Slots.FirstOrDefaultAsync(x => x.Id == s.Id);
        if (slot != null) slot.IsDeleted = true;
        await dbContext.SaveChangesAsync();
    }

    public async Task<List<Slot>> GetAll()
    {
        return await dbContext.Slots.Include(s => s.Schedules).ToListAsync();
    }

    public async Task<Slot?> GetById(Guid id)
    {
        return await dbContext.Slots.FirstOrDefaultAsync(s => Guid.Equals(s.Id, id));
    }

    public async Task<bool> Exist(Guid id) => await dbContext.Slots.AnyAsync(x => x.Id == id && !x.IsDeleted);
    //check if the time slot exists aleast 15 minutes in the database
    public async Task<bool> CheckNoExist(int no) => await dbContext.Slots.AnyAsync(s => s.No == no);
    

    //check time slot exists in the database, prevent overlapping
    public async Task<bool> CheckTimeExist(DateTime startAt, DateTime endAt, Guid? excludeSlotId = null)
        => await dbContext.Slots.AnyAsync(x => !x.IsDeleted
                                               && x.StartAt < endAt
                                               && x.EndAt > startAt
                                               && (!excludeSlotId.HasValue || x.Id != excludeSlotId.Value));
    //get all slots with schedules and accounts
    public async Task<List<Slot>> ViewAllSlot()
    {
        var slots = await dbContext.Slots
            .Include(s => s.Schedules)
            .ThenInclude(sc => sc.Account)
            .Where(s => !s.IsDeleted) 
            .ToListAsync();

        return slots;    }

    public async Task<bool> DeleteById(Guid id)
    {
        var slot = await dbContext.Slots.FirstOrDefaultAsync(x => x.Id == id);
        if (slot is not { }) return false;
        slot.IsDeleted = true;
        await dbContext.SaveChangesAsync();
        return true;
    }

    public async Task Update(Slot s)
    {
        dbContext.Slots.Update(s);
        await dbContext.SaveChangesAsync();
    }
}