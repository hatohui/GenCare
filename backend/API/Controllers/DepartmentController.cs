using Application.DTOs.Department.Request;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

/// <summary>
/// API controller for department-related operations.
/// </summary>
[Route("api/departments")]
[ApiController]
public class DepartmentController(IDepartmentService departmentService) : ControllerBase
{
    /// <summary>
    /// Retrieves all departments.
    /// </summary>
    /// <returns>An <see cref="IActionResult"/> containing the list of departments.</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllDepartmentsAsync()
    {
        var response = await departmentService.GetAllDepartment();
        return Ok(response);
    }
    [HttpPost]
    [Authorize(Roles = $"{RoleNames.Admin}")]
    public async Task<IActionResult> CreateDepartmentAsync([FromBody] CreateDepartmentRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest("Invalid department data.");
        }

        var response = await departmentService.CreateDepartment(request);
        if (response.Success)
        {
            return Ok(response);
        }
        
        return BadRequest(response.Message);
    }
}