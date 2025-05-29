using Domain.Entities;

namespace Application.Repositories;

public interface IRoleRepository
{
    Task<Role?> GetRoleByNameAsync(string name);
}