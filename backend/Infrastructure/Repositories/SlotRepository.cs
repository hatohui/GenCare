using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
        if(slot != null) slot.IsDeleted = true;
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

    public async Task Update(Slot s)
    {
        dbContext.Slots.Update(s);
        await dbContext.SaveChangesAsync();
    }
}
