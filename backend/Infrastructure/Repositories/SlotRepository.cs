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
    public Task Add(Slot s)
    {
        throw new NotImplementedException();
    }

    public Task Delete(Slot s)
    {
        throw new NotImplementedException();
    }

    public async Task<List<Slot>> GetAll()
    {
        return await dbContext.Slots.ToListAsync();
    }

    public async Task<Slot?> GetById(Guid id)
    {
        return await dbContext.Slots.FirstOrDefaultAsync(s => Guid.Equals(s.Id, id));
    }

    public Task Update(Slot s)
    {
        throw new NotImplementedException();
    }
}
