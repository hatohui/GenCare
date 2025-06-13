using Domain.Entities;

namespace Application.Repositories;

public interface IDepartmentRepository
{
    Task<Department?> GetDepartmentByIdAsync(Guid id);
}