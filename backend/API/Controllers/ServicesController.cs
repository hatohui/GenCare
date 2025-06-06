using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Responses;
using Application.Services;

namespace API.Controllers;

[ApiController]
[Route("api/services")]
public class ServicesController(IServicesService servicesService) : ControllerBase
{
 

    /// <summary>
    /// Search and get all services by optional name or price filter.
    /// </summary>
    /// <param name="request">Search parameters (name, price, page, count)</param>
    /// <returns>Paged result with total count and list of services</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ViewServiceByPageResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Search([FromQuery] ViewServicesByPageRequest request)
    {
        var services = await servicesService.SearchServiceAsync(request);
        return Ok(services);
    }
    /// <summary>
    /// Get service details by Id.
    /// </summary>
    /// <param name="id">Service Id</param>
    /// <returns>Service details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ViewServiceResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById([FromRoute] string id)
    {
        var request = new ViewServiceWithIdRequest { Id = id };
        try
        {
            var service = await servicesService.SearchServiceByIdAsync(request);
            return Ok(service);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }

    }

    /// <summary>
    /// Create a new service. Only admin or staff can create.
    /// </summary>
    /// <param name="request">Service info</param>
    /// <returns>Created service</returns>
    [HttpPost]
    [ProducesResponseType(typeof(CreateServiceResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Create([FromBody] CreateServiceRequest request)
    {
        // Lấy accessToken từ header => Service ko truy cập HTTPContext trực tiếp
        var tokenHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
        var accessToken = tokenHeader != null && tokenHeader.StartsWith("Bearer ")
            ? tokenHeader.Substring(7)
            : string.Empty;

        try
        {
            var created = await servicesService.CreateServiceAsync(request, accessToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    /// <summary>
    /// Update a service. Only admin or staff can update.
    /// </summary>
    /// <param name="request">Service update info (including Id)</param>
    /// <returns>Update result</returns>
    [HttpPost("update")]
    [ProducesResponseType(typeof(UpdateServiceResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Update([FromBody] UpdateServiceRequest request)
    {
        var tokenHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
        var accessToken = tokenHeader != null && tokenHeader.StartsWith("Bearer ")
            ? tokenHeader.Substring(7)
            : string.Empty;

        try
        {
            var result = await servicesService.UpdateServiceByIdAsync(request, accessToken);
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            if (ex.Message == "Service not found")
                return NotFound(ex.Message);
        
            return BadRequest(ex.Message);
        }
    }
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(DeleteServiceResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        var tokenHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
        var accessToken = tokenHeader != null && tokenHeader.StartsWith("Bearer ")
            ? tokenHeader.Substring(7)
            : string.Empty;
    
        var request = new DeleteServiceRequest { Id = id };
    
        try
        {
            var result = await servicesService.DeleteServiceByIdAsync(request, accessToken);
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}