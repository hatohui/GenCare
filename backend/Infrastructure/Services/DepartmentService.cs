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

    public async Task<CreateDepartmentResponse> CreateDepartment(CreateDepartmentRequest request)
    {
        // Check if the department name already exists
        var exists = await departmentRepository.CheckNameDepartmentExists(request.Name);
        if (exists)
        {
            return new CreateDepartmentResponse
            {
                Success = false,
                Message = "Department name already exists."
            };
        }

        // Add the new department
        var result = await departmentRepository.AddAsync(request.Name, request.Description ?? string.Empty);
        return new CreateDepartmentResponse
        {
            Success = result,
            Message = result ? "Department created successfully." : "Failed to create department."
        };
        
    }

    public async Task<UpdateDepartmentResponse> UpdateDepartment(UpdateDepartmentRequest request)
    {
        // Retrieve the existing department
        var existingDepartment = await departmentRepository.GetDepartmentByIdAsync(request.DepartmentId);
        if (existingDepartment == null)
        {
            return new UpdateDepartmentResponse
            {
                Success = false,
                Message = "Department not found."
            };
        }

        // Check if the name is being changed and if the new name already exists
        if (!string.Equals(existingDepartment.Name, request.Name, StringComparison.OrdinalIgnoreCase))
        {
            var nameExists = await departmentRepository.CheckNameDepartmentExists(request.Name ?? string.Empty);
            if (nameExists)
            {
                return new UpdateDepartmentResponse
                {
                    Success = false,
                    Message = "Department name already exists."
                };
            }
        }

        // Update the department's properties
        existingDepartment.Name = request.Name ?? existingDepartment.Name;
        if (request.Description != null)
        {
            existingDepartment.Description = request.Description;
        }

        // Save the changes
        var result = await departmentRepository.UpdateAsync(existingDepartment);

        return new UpdateDepartmentResponse
        {
            Success = result,
            Message = result ? "Department updated successfully." : "Failed to update department."
        };
    }
}