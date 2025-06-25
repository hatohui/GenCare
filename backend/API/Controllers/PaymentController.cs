using System.Threading.Tasks;
using Application.DTOs.Payment.Momo;
using Application.Services;

namespace API.Controllers;
[Route("api/payments")]
[ApiController]
public class PaymentController(IMomoService momoService) : ControllerBase
{
    //api return url 
    [HttpPost("momo")]
    public async Task<IActionResult> CreateMomoPayment([FromQuery] string purchaseId)
    {
        var result = await momoService.CreatePaymentAsync(purchaseId);
        return Ok(result);
    }

    [HttpPost("momo-callback")]
    public async Task<IActionResult> MomoNotify([FromBody] MomoIpnRequest request)
    {
        var response = await momoService.ProcessPaymentCallback(request);
        // Xử lý thông báo từ MoMo, cập nhật trạng thái đơn hàng trong database
        return NoContent();
    }
}
