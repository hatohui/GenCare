using Application.Repositories;
using Application.Services;

namespace Infrastructure.Services;
public class OrderDetailPdfService : IOrderDetailPdfService
{
    private readonly IOrderDetailRepository _orderDetailRepository;

    public OrderDetailPdfService(IOrderDetailRepository orderDetailRepository)
    {
        _orderDetailRepository = orderDetailRepository;
    }

    public async Task<byte[]?> GenerateResultPdfAsync(Guid orderDetailId, CancellationToken cancellationToken = default)
    {
        var orderDetail = await _orderDetailRepository.GetOrderDetailWithResultAsync(orderDetailId, cancellationToken);

        if (orderDetail == null || orderDetail.Result == null)
        {
            return null;
        }

        var gender = orderDetail.Gender ? "Nam" : "Nữ";
        var result = orderDetail.Result;
        var status = result?.Status == true ? "Đã có kết quả" : "Chưa có kết quả";

        var htmlContent = $@"
<!DOCTYPE html>
<html lang='vi'>
<head>
    <meta charset='utf-8'>
    <title>Kết Quả Xét Nghiệm</title>
    <style>
        body {{ font-family: Arial, sans-serif; }}
        table {{ border-collapse: collapse; width: 100%; margin-top: 20px; }}
        td, th {{ border: 1px solid #dddddd; text-align: left; padding: 8px; }}
        th {{ background-color: #f2f2f2; }}
    </style>
</head>
<body>
    <h2>KẾT QUẢ XÉT NGHIỆM</h2>
    <h3>Thông tin bệnh nhân</h3>
    <table>
        <tr><th>Họ và tên</th><td>{orderDetail.LastName} {orderDetail.FirstName}</td></tr>
        <tr><th>Số điện thoại</th><td>{orderDetail.Phone}</td></tr>
        <tr><th>Ngày sinh</th><td>{orderDetail.DateOfBirth:dd/MM/yyyy}</td></tr>
        <tr><th>Giới tính</th><td>{gender}</td></tr>
    </table>
    <h3>Kết quả xét nghiệm</h3>
    <table>
        <tr><th>Mã phiếu</th><td>{orderDetail.Id}</td></tr>
        <tr><th>Ngày đặt xét nghiệm</th><td>{result?.OrderDate:dd/MM/yyyy}</td></tr>
        <tr><th>Ngày lấy mẫu</th><td>{result?.SampleDate:dd/MM/yyyy}</td></tr>
        <tr><th>Ngày trả kết quả</th><td>{result?.ResultDate:dd/MM/yyyy}</td></tr>
        <tr><th>Trạng thái</th><td>{status}</td></tr>
        <tr><th>Kết quả chi tiết</th><td>{result?.ResultData ?? "Chưa có dữ liệu"}</td></tr>
    </table>
</body>
</html>";

        var renderer = new ChromePdfRenderer();
        var pdf = await Task.Run(() => renderer.RenderHtmlAsPdf(htmlContent), cancellationToken);
        return pdf.BinaryData;
    }
}