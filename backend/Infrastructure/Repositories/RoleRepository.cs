using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Repositories;
public class RoleRepository(IApplicationDbContext context) : IRoleRepository
{

    public async Task<Role?> GetRoleByNameAsync(string name)
    {
        return await context.Roles.FirstOrDefaultAsync(r => r.Name == name);
    }
}
