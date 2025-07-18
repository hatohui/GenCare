using Application.Helpers;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;
[Route("api/orderDetails")]
[ApiController]
public class OrderDetailController(IOrderDetailService orderDetailService, IOrderDetailPdfService orderDetailPdfService) : ControllerBase
{
    [HttpDelete("{id}")]
    [Authorize(Roles = $"{RoleNames.Member}, {RoleNames.Admin}")]
    public async Task<IActionResult> DeleteOrderDetail([FromRoute] string id)
    {
        //get access token from header
        var accessToken = AuthHelper.GetAccessToken(HttpContext);
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken).ToString("D");
        if (string.IsNullOrEmpty(accountId))
        {
            return Unauthorized("Invalid access token");
        }
        await orderDetailService.DeleteOrderDetail(id, accountId);
        return NoContent();
    }

    /// <summary>
    /// Xuất PDF kết quả xét nghiệm của bệnh nhân.
    /// </summary>
    [HttpGet("{orderDetailId}/result-pdf")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetResultPdf([FromRoute] Guid orderDetailId, CancellationToken cancellationToken)
    {
        var pdfBytes = await orderDetailPdfService.GenerateResultPdfAsync(orderDetailId, cancellationToken);
        if (pdfBytes == null)
        {
            return NotFound(new { message = "Không tìm thấy thông tin..." });
        }
        var fileName = $"KetQuaXetNghiem_{orderDetailId}.pdf";
        // Đảm bảo Header Content-Disposition là attachment
        return File(pdfBytes, "application/pdf", fileName);
    }
}
