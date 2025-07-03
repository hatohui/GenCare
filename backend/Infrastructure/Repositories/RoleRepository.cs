using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class RoleRepository(IApplicationDbContext context) : IRoleRepository
{
    public async Task<List<Role>> GetAll()
    {
        return await context.Roles
            .ToListAsync();
    }

    public async Task<Role?> GetRoleByIdAsync(Guid id)
    {
        return await context.Roles
            .FirstOrDefaultAsync(r => Guid.Equals(r.Id, id));
    }

    public async Task<Role?> GetRoleByNameAsync(string name)
    {
        return await context.Roles.FirstOrDefaultAsync(r => r.Name.ToLower() == name.ToLower());
    }
}