using System.Text;
using System.Text.Json;
using Application.Repositories;
using Application.Services;

namespace Infrastructure.Services
{
    public class TestItem
    {
        public double Value { get; set; }
        public string? Unit { get; set; }
        public string? ReferenceRange { get; set; }
        public string? Flag { get; set; }
    }

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
            string resultTableHtml = BuildResultTableHtml(result?.ResultData);
            var logoBase64 = GetLogoBase64();
            var templatePath = Path.Combine(AppContext.BaseDirectory, "Infrastructure", "Services", "OrderDetailPdfTemplate.html");
            var htmlTemplate = await File.ReadAllTextAsync(templatePath, cancellationToken);
            var htmlContent = htmlTemplate
                .Replace("{{LogoBase64}}", logoBase64)
                .Replace("{{LastName}}", orderDetail.LastName)
                .Replace("{{FirstName}}", orderDetail.FirstName)
                .Replace("{{Phone}}", orderDetail.Phone)
                .Replace("{{DateOfBirth}}", orderDetail.DateOfBirth.ToString("dd/MM/yyyy"))
                .Replace("{{Gender}}", gender)
                .Replace("{{OrderId}}", orderDetail.Id.ToString())
                .Replace("{{OrderDate}}", result?.OrderDate is DateTime dt1 ? dt1.ToString("dd/MM/yyyy") : "")
                .Replace("{{SampleDate}}", result?.SampleDate is DateTime dt2 ? dt2.ToString("dd/MM/yyyy") : "")
                .Replace("{{ResultDate}}", result?.ResultDate is DateTime dt3 ? dt3.ToString("dd/MM/yyyy") : "")
                .Replace("{{Status}}", status)
                .Replace("{{ResultTableHtml}}", resultTableHtml);
            var renderer = new ChromePdfRenderer();
            var pdf = await Task.Run(() => renderer.RenderHtmlAsPdf(htmlContent), cancellationToken);
            return pdf.BinaryData;
        }

        private static string BuildResultTableHtml(string? resultData)
        {
            if (string.IsNullOrEmpty(resultData))
            {
                return "Chưa có dữ liệu";
            }

            try
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var testItems = JsonSerializer.Deserialize<Dictionary<string, TestItem>>(resultData, options);

                if (testItems != null && testItems.Count > 0)
                {
                    var sb = new StringBuilder();
                    sb.AppendLine("<table border='1' style='border-collapse:collapse;width:100%;'>");
                    sb.AppendLine("<tr><th>Tên chỉ số</th><th>Giá trị</th><th>Đơn vị</th><th>Khoảng tham chiếu</th><th>Trạng thái</th></tr>");

                    foreach (var item in testItems)
                    {
                        string flagText = item.Value.Flag ?? string.Empty;
                        string flagColor = flagText.ToLower() switch
                        {
                            "normal" => "color:green;",
                            "high" => "color:red;",
                            "low" => "color:orange;",
                            _ => ""
                        };
                        sb.AppendLine("<tr>");
                        sb.AppendLine($"<td>{item.Key}</td>");
                        sb.AppendLine($"<td>{item.Value.Value}</td>");
                        sb.AppendLine($"<td>{item.Value.Unit}</td>");
                        sb.AppendLine($"<td>{item.Value.ReferenceRange}</td>");
                        sb.AppendLine($"<td style='{flagColor}'>{flagText}</td>");
                        sb.AppendLine("</tr>");
                    }

                    sb.AppendLine("</table>");
                    return sb.ToString();
                }
                else
                {
                    return "Chưa có dữ liệu";
                }
            }
            catch
            {
                return "Dữ liệu xét nghiệm không hợp lệ!";
            }
        }

        private static string GetLogoBase64()
        {
            var logoPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "frontend", "public", "images", "gencarelogo.png");
            var fullLogoPath = Path.GetFullPath(logoPath);
            Console.WriteLine($"[PDF] Logo path: {fullLogoPath}");
            if (!File.Exists(fullLogoPath))
            {
                Console.WriteLine("[PDF] Logo file NOT FOUND!");
                return string.Empty;
            }
            var bytes = File.ReadAllBytes(fullLogoPath);
            var base64 = Convert.ToBase64String(bytes);
            if (string.IsNullOrEmpty(base64))
            {
                Console.WriteLine("[PDF] Logo base64 is EMPTY!");
            }
            else
            {
                Console.WriteLine($"[PDF] Logo base64 length: {base64.Length}");
            }
            return base64;
        }
    }
}