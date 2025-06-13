using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
}
