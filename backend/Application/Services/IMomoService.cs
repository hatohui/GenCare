using Application.DTOs.Payment.Momo;
using Microsoft.AspNetCore.Http;

namespace Application.Services;
public interface IMomoService
{
    Task<MomoPaymentResponse> CreatePaymentAsync(string purchaseId);
    Task<MomoPaymentResponse> ProcessPaymentCallback(IQueryCollection collection);
}
