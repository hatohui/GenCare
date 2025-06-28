using Application.DTOs.Payment.ManualPayment.Request;
using Application.Repositories;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;
[ApiController]
[Route("api/manual-payment")]
[Authorize(Roles = $"{RoleNames.Admin},{RoleNames.Staff}")]
public class ManualPaymentController(IManualPaymentService manualPaymentService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> ConfirmManualPayment([FromBody] ConfirmPaymentByStaffRequest request)
    {
        var result = await manualPaymentService.ConfirmAsync(request);
        

        return Ok(result);
    }
}