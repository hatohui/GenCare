namespace Application.DTOs.Purchase;
public class OrderInfo
{
    public string FullName { get; set; } = null!;
    public string PurchaseId { get; set; } = null!;
    public string PurchaseInfo { get; set; } = null!;
    public float Amount { get; set; }
}
