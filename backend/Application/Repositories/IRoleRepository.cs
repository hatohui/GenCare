using Domain.Entities;

namespace Application.Repositories;

/// <summary>
/// Provides data access methods for role entities.
/// </summary>
public interface IRoleRepository
{
    /// <summary>
    /// Retrieves a role by its name.
    /// </summary>
    /// <param name="name">The name of the role.</param>
    /// <returns>The role if found; otherwise, null.</returns>
    Task<Role?> GetRoleByNameAsync(string name);

    /// <summary>
    /// Retrieves a role by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the role.</param>
    /// <returns>The role if found; otherwise, null.</returns>
    Task<Role?> GetRoleByIdAsync(Guid id);
    Task<List<Role>> GetAll();
}