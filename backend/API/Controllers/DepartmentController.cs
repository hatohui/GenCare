
using Application.Services;

namespace API.Controllers;
[Route("api/departments")]
[ApiController]
public class DepartmentController(IDepartmentService departmentService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllDepartmentsAsync()
    {
        var response = await departmentService.GetAllDepartment();
        return Ok(response);
    }
}
