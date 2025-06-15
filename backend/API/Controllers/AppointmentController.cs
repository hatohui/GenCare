using Application.DTOs.Appointment.Request;
using Application.Helpers;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
[Route("api/appointments")]
[ApiController]
public class AppointmentController(IAppointmentService appointmentService) : ControllerBase
{
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateAppointmentAsync([FromBody] AppointmentCreateRequest request)
    {
        //get access token
        var accessToken = AuthHelper.GetAccessToken(HttpContext);
        //get id
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken);
        //call service
        await appointmentService.CreateAppointmentAsync(request, accountId.ToString(""));
        return Created();
    }
}
