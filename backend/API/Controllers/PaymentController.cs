using Application.Services;

namespace API.Controllers;
[Route("api/payment")]
[ApiController]
public class PaymentController(IMomoService momoService) : ControllerBase
{
    //api return url 
    //
    [HttpPost("momo-payment/{id}")]
    public async Task<IActionResult> CreateMomoPayment([FromRoute] string id)
    {
        var result = await momoService.CreatePaymentAsync(id);
        return Ok(new { payUrl = result.PayUrl, result });
    }
    [HttpPost("momo-callback")]
    public IActionResult MomoNotify()
    {
        var response = momoService.ProcessPaymentCallback(Request.Query);
        // Xử lý thông báo từ MoMo, cập nhật trạng thái đơn hàng trong database
        return Ok(new { RspCode = "00", Message = "Success" });
    }
}
