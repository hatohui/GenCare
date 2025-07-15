using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Role;

namespace Application.Services;
public interface IRoleService
{
    Task<List<RoleModel>> GetAllRoles();
}
