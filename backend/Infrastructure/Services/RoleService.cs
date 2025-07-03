using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Role;
using Application.Repositories;
using Application.Services;

namespace Infrastructure.Services;
public class RoleService(IRoleRepository roleRepository) : IRoleService 
{
    public async Task<List<RoleModel>> GetAllRoles()
    {
        var roles = await roleRepository.GetAll();
        List<RoleModel> roleModels = new();
        foreach (var role in roles)
        {
            roleModels.Add(new RoleModel
            {
                Id = role.Id.ToString("D"),
                Name = role.Name,
                Description = role.Description
            });
        }
        return roleModels;
    }
}
