using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class RoleRepository(IApplicationDbContext context) : IRoleRepository
{
    public async Task<Role?> GetRoleByNameAsync(string name)
    {
        return await context.Roles.FirstOrDefaultAsync(r => r.Name.ToLower() == name.ToLower());
    }
}