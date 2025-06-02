using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;
public class ServiceRepository(IApplicationDbContext dbContext) : IServiceRepository
{
    public async Task<Service?> GetByIdAsync(Guid id)
    {
        return await dbContext.Services.FirstOrDefaultAsync(s => s.Id == id);
    }
}
