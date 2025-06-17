using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class DepartmentRepository(IApplicationDbContext dbContext) : IDepartmentRepository
{
    public async Task<List<Department>> GetAll()
    {
        return await dbContext.Departments
            .Include(d => d.StaffInfos)
            .ToListAsync();
    }

    public async Task<bool> AddAsync(string name, string description)
    {
        var department = new Department
        {
            Name = name,
            Description = description
        };

        await dbContext.Departments.AddAsync(department);
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<bool> CheckNameDepartmentExists(string name)
    {
        return await dbContext.Departments
            .AnyAsync(d => d.Name.ToLower() == name.ToLower());
    }

    public async Task<bool> UpdateAsync(Department department)
    {
        dbContext.Departments.Update(department);
        return await dbContext.SaveChangesAsync() > 0;
    }
   
    public async Task<Department?> GetDepartmentByIdAsync(Guid id)
    {
        return await dbContext.Departments
            .Include(d => d.StaffInfos)
            .FirstOrDefaultAsync(d => Guid.Equals(d.Id, id));
    }
}