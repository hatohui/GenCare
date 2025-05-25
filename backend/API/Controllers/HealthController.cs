namespace API.Controllers
{
    /// <summary>
    /// Provides a simple health check endpoint to verify if the API is running.
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class HealthController : ControllerBase
    {
        /// <summary>
        /// Performs a health check to verify if the API is healthy and responsive.
        /// </summary>
        /// <remarks>
        /// This is a simple health check endpoint used for monitoring and ensuring that the API is up and running.
        /// </remarks>
        /// <returns>
        /// A string message "Healthy" if the service is up and running.
        /// </returns>
        /// <response code="200">Returns a healthy status message if the API is up and running.</response>
        [HttpGet]
        [ProducesResponseType(typeof(string), 200)] // Indicates that a successful response returns a string with HTTP 200.
        public IActionResult Health()
        {
            return Ok("I'm super healthy");
        }
    }
}
