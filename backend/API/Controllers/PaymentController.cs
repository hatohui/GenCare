using System.Threading.Tasks;
using Application.Services;

namespace API.Controllers;
[Route("api/payment")]
[ApiController]
public class PaymentController(IMomoService momoService) : ControllerBase
{
    //api return url 
    [HttpPost("momo")]
    public async Task<IActionResult> CreateMomoPayment([FromQuery] string purchaseId)
    {
        var result = await momoService.CreatePaymentAsync(purchaseId);
        return Ok(new { payUrl = result.PayUrl, result });
    }

    [HttpPost("momo-callback")]
    public async Task<IActionResult> MomoNotify()
    {
        var response = await momoService.ProcessPaymentCallback(Request.Query);
        // Xử lý thông báo từ MoMo, cập nhật trạng thái đơn hàng trong database
        return Ok(new { RspCode = "00", Message = "Success" });
    }
}
