using Application.DTOs.Purchase.Request;
using Application.DTOs.Purchase.Response;

namespace Application.Services;

public interface IPurchaseService
{
    Task<BookingServiceResponse> AddPurchaseAsync(BookingServiceRequest bookingServiceRequest, string accessToken);
}