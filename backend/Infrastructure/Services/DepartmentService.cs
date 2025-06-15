
using Application.DTOs.Department.Response;
using Application.Repositories;
using Application.Services;

namespace Infrastructure.Services;
public class DepartmentService(IDepartmentRepository departmentRepository) : IDepartmentService
{
    public async Task<List<DepartmentGetResponse>> GetAllDepartment()
    {
        var departments = await departmentRepository.GetAll();
        return departments.Select(d => new DepartmentGetResponse
        {
            Id = d.Id.ToString("d"),
            Name = d.Name,
            Description = d.Description,
        }).ToList();
    }
}
