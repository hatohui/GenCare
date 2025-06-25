namespace Application.DTOs.Payment.ManualPayment.Response;

public class ConfirmPaymentByStaffResponse
{
    public Guid PurchaseId { get; set; }
    public string TransactionId { get; set; } = null!;      
    public decimal Amount { get; set; }             
    public string? PaymentMethod { get; set; }       
    public string? Status { get; set; }              
    public DateTime CreatedAt { get; set; }         
    public DateTime? ExpiredAt { get; set; }  
}