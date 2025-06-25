using Application.DTOs.Payment.ManualPayment.Request;
using Application.DTOs.Payment.ManualPayment.Response;

namespace Application.Repositories;

public interface IManualPaymentService
{
    Task<ConfirmPaymentByStaffResponse> ConfirmAsync(ConfirmPaymentByStaffRequest request);
}