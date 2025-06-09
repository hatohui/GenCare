using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;
public class DepartmentRepository(IApplicationDbContext dbContext) : IDepartmentRepository
{
    public async Task<Department?> GetDepartmentByIdAsync(Guid id)
    {
        return await dbContext.Departments
            .Include(d => d.StaffInfos)
            .FirstOrDefaultAsync(d => Guid.Equals(d.Id, id));
    }
}
