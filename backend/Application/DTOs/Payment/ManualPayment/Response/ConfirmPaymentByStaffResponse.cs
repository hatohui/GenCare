namespace Application.DTOs.Payment.ManualPayment.Response;

public class ConfirmPaymentByStaffResponse
{
   public bool Success { get; set; }
   public string Message { get; set; } = null!;
}