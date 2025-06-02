using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Responses;
using Application.DTOs.Service.Responses;
using Application.Helpers;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/services")]
public class ServicesController(IServicesService _servicesService) : ControllerBase
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
        var services = await _servicesService.SearchServiceAsync(request);
        return Ok(services);
    }
    /// <summary>
    /// Get service details by Id.
    /// </summary>
    /// <param name="id">Service Id</param>
    /// <returns>Service details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ViewSearchWithIdResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById([FromRoute] string id)
    {
        var request = new ViewServiceWithIdRequest { Id = id };
        try
        {
            var service = await _servicesService.SearchServiceByIdAsync(request);
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
            var created = await _servicesService.CreateServiceAsync(request, accessToken);
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
}