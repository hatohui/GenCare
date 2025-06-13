
using Application.DTOs.Department.Response;
using Application.Repositories;

namespace Application.Services;
public interface IDepartmentService
{
    Task<List<DepartmentGetResponse>> GetAllDepartment();
}
