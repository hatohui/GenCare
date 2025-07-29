using Application.DTOs.Appointment.Request;
using Application.DTOs.Appointment.Response;
using Application.DTOs.Zoom;
using Application.Helpers;
using Application.Services;
using Domain.Common.Constants;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

/// <summary>
/// Handles appointment-related API endpoints such as creating, viewing, updating, and deleting appointments.
/// </summary>
[Route("api/appointments")]
[ApiController]
public class AppointmentController(
    IAppointmentService appointmentService,
    IZoomService zoomService,
    IConfiguration configuration
) : ControllerBase
{
    /// <summary>
    /// Creates a new appointment.
    /// </summary>
    /// <param name="request">The appointment creation request.</param>
    /// <returns>A <see cref="CreatedResult"/> if successful.</returns>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateAppointmentAsync(
        [FromBody] AppointmentCreateRequest request
    )
    {
        //get access token
        var accessToken = AuthHelper.GetAccessToken(HttpContext);
        //get id
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken);
        //call service
        await appointmentService.CreateAppointmentAsync(request, accountId.ToString(""));
        return Created();
    }

    /// <summary>
    /// Creates a new appointment with Zoom meeting integration.
    /// </summary>
    /// <param name="request">The appointment creation request.</param>
    /// <returns>Appointment details with Zoom meeting information.</returns>
    [HttpPost("with-zoom")]
    [Authorize]
    public async Task<IActionResult> CreateAppointmentWithZoomAsync(
        [FromBody] AppointmentCreateRequest request
    )
    {
        try
        {
            //get access token
            var accessToken = AuthHelper.GetAccessToken(HttpContext);
            //get id
            var accountId = JwtHelper.GetAccountIdFromToken(accessToken);

            // Create appointment with Zoom meeting using the service
            var zoomMeeting = await appointmentService.CreateAppointmentWithZoomAsync(
                request,
                accountId.ToString("")
            );

            // Return the Zoom meeting details
            var response = new
            {
                success = true,
                message = "Appointment created successfully with Zoom meeting",
                zoomMeeting = new
                {
                    meetingId = zoomMeeting.Id,
                    topic = zoomMeeting.Topic,
                    startTime = zoomMeeting.StartTime,
                    duration = zoomMeeting.Duration,
                    joinUrl = zoomMeeting.JoinUrl,
                    startUrl = zoomMeeting.StartUrl,
                    password = zoomMeeting.Password,
                },
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Retrieves all appointments. Only accessible by Manager or Admin roles.
    /// </summary>
    /// <returns>A list of all appointments.</returns>
    [HttpGet]
    [Authorize(
        Roles = $"{RoleNames.Manager},{RoleNames.Admin},{RoleNames.Member},{RoleNames.Staff},{RoleNames.Consultant}"
    )]
    public async Task<IActionResult> ViewAllAppointment()
    {
        //get access token
        var accessToken = AuthHelper.GetAccessToken(HttpContext);
        //get id
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken);
        //call service
        var appointments = await appointmentService.ViewAllAppointmentsAsync(
            accountId.ToString("D")
        );
        return Ok(appointments);
    }

    /// <summary>
    /// Updates an existing appointment by ID. Only accessible by Manager or Admin roles.
    /// </summary>
    /// <param name="request">The appointment update request.</param>
    /// <param name="id">The unique identifier of the appointment to update.</param>
    /// <returns>No content if successful.</returns>
    [HttpPut("{id}")]
    [Authorize(Roles = $"{RoleNames.Manager},{RoleNames.Admin}")]
    public async Task<IActionResult> UpdateAppointment(
        [FromBody] AppointmentUpdateRequest request,
        [FromRoute] string id
    )
    {
        //get access token
        var accessToken = AuthHelper.GetAccessToken(HttpContext);
        //get id
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken);
        await appointmentService.UpdateAppointmentAsync(request, id, accountId.ToString("D"));
        return NoContent(); //204
    }

    /// <summary>
    /// Deletes an appointment by ID. Only accessible by Manager or Admin roles.
    /// </summary>
    /// <param name="id">The unique identifier of the appointment to delete.</param>
    /// <returns>No content if successful.</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = $"{RoleNames.Manager},{RoleNames.Admin}")]
    public async Task<IActionResult> DeleteAppointment([FromRoute] string id)
    {
        //get access token
        var accessToken = AuthHelper.GetAccessToken(HttpContext);
        //get id
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken);
        await appointmentService.DeleteAppointmentAsync(id, accountId.ToString("D"));
        return NoContent(); //204
    }

    [HttpGet("{id}")]
    [Authorize(
        Roles = $"{RoleNames.Staff},{RoleNames.Member},{RoleNames.Admin},{RoleNames.Manager}"
    )]
    public async Task<IActionResult> GetAppoinmentById([FromRoute] string id)
    {
        //get access token from header
        var access = AuthHelper.GetAccessToken(HttpContext);
        //get id from access
        var accountId = JwtHelper.GetAccountIdFromToken(access);
        var response = await appointmentService.ViewAppointmentByIdAsync(
            id,
            accountId.ToString("D")
        );
        return Ok(response);
    }

    /// <summary>
    /// Test endpoint to verify Zoom API credentials and JWT token generation.
    /// </summary>
    /// <returns>Zoom API configuration status.</returns>
    [HttpGet("test-zoom")]
    [Authorize]
    public async Task<IActionResult> TestZoomConfiguration()
    {
        try
        {
            var clientId = Environment.GetEnvironmentVariable("ZOOM_CLIENT_ID");
            var clientSecret = Environment.GetEnvironmentVariable("ZOOM_CLIENT_SECRET");
            var accountId = Environment.GetEnvironmentVariable("ZOOM_ACCOUNT_ID");

            var response = new
            {
                hasClientId = !string.IsNullOrEmpty(clientId),
                hasClientSecret = !string.IsNullOrEmpty(clientSecret),
                hasAccountId = !string.IsNullOrEmpty(accountId),
                clientIdPreview = clientId?.Substring(0, Math.Min(10, clientId?.Length ?? 0))
                    + "...",
                clientSecretPreview = clientSecret?.Substring(
                    0,
                    Math.Min(10, clientSecret?.Length ?? 0)
                ) + "...",
                accountId = accountId,
                message = "Check the logs for detailed OAuth token generation information",
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
