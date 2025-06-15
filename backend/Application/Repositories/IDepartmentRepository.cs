using Domain.Entities;

namespace Application.Repositories;

/// <summary>
/// Provides data access methods for department entities.
/// </summary>
public interface IDepartmentRepository
{
    /// <summary>
    /// Retrieves a department by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the department.</param>
    /// <returns>The department if found; otherwise, null.</returns>
    Task<Department?> GetDepartmentByIdAsync(Guid id);

    /// <summary>
    /// Retrieves all departments.
    /// </summary>
    /// <returns>A list of all departments.</returns>
    Task<List<Department>> GetAll();
}