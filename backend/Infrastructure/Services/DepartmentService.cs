using Application.DTOs.Department.Request;
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

    public async Task<CreateDepartmentResponse> CreateDepartment(CreateDepartmentRequest department)
    {
        // Check if the department name already exists
        var exists = await departmentRepository.CheckNameDepartmentExists(department.Name);
        if (exists)
        {
            return new CreateDepartmentResponse
            {
                Success = false,
                Message = "Department name already exists."
            };
        }

        // Add the new department
        var result = await departmentRepository.AddAsync(department.Name, department.Description ?? string.Empty);
        return new CreateDepartmentResponse
        {
            Success = result,
            Message = result ? "Department created successfully." : "Failed to create department."
        };
        
    }
}