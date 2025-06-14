using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Repositories;
public interface ISlotRepository
{
    Task<List<Slot>> GetAll();
    Task Add(Slot s);
    Task Delete(Slot s);
    Task Update(Slot s);
    Task<Slot?> GetById(Guid id);
}
