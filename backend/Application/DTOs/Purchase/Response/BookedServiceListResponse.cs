namespace Application.DTOs.Purchase.Response;

public class BookedServiceListResponse
{
    public string PurchaseId { get; set; } = default!;
    public bool IsPaid { get; set; }
    public decimal Price { get; set; }
    public List<BookedServiceModel> Order { get; set; } = [];

}