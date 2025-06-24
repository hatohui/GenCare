using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
[Route("api/paymentHistory")]
[ApiController]
public class PaymentHistoryController(IPaymentHistoryService paymentHistoryService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await paymentHistoryService.GetAllPaymentHistoriesAsync();
        return Ok(list);
    }
}
