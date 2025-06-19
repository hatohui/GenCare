namespace Application.DTOs.Payment.Momo;
public class MomoPaymentResponse
{
    public string PartnerCode { get; set; }
    public string RequestId { get; set; }
    public string OrderId { get; set; }
    public decimal Amount { get; set; }
    public long ResponseTime { get; set; }
    public string Message { get; set; }
    public string ResultCode { get; set; }
    public string PayUrl { get; set; }
    public string TransactionId { get; set; }
    public string PaymentType { get; set; }
    public string ResponseCode { get; set; }
    public bool Success { get; set; }

}