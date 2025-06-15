
using Application.Services;

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
}
