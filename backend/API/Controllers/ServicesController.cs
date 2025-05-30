using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Application.Services;

namespace API.Controllers;


    [ApiController]
    [Route("api/services")]
    public class ServicesController(IServicesService servicesService) : ControllerBase
    {
        /// <summary>
        /// Search and get all services by optional name or price filter.
        /// </summary>
        /// <param name="request">Search parameters (name, price)</param>
        /// <returns>List of matching services</returns>
        [HttpGet]
        [ProducesResponseType(typeof(List<SearchServicesResponse>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Search([FromQuery] SearchServicesRequest request)
        {
            var services = await servicesService.SearchServiceAsync(request);
            return Ok(services);
        }
}