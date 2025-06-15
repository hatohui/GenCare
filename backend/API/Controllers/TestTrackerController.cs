using Application.DTOs.TestTracker.Request;
using Application.Services;

namespace API.Controllers;
[ApiController]
[Route("api/result")]
public class TestTrackerController(ITestTrackerService testTrackerService) : ControllerBase
{
    
    [HttpGet("{id}")]
    public async Task<IActionResult> ViewTestTrackerById(Guid id)
    {
        var result = await testTrackerService.ViewTestResultAsync(id) ;
        
        if (result == null)
            return NotFound();
        
        return Ok(result);
    }

}