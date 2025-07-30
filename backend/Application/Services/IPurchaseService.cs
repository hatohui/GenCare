using Application.DTOs.Purchase.Request;
using Application.DTOs.Purchase.Response;

namespace Application.Services
{
    /// <summary>
    /// Provides purchase-related service operations.
    /// </summary>
    public interface IPurchaseService
    {
        /// <summary>
        /// Adds a new purchase based on the provided booking service request and access token.
        /// </summary>
        /// <param name="bookingServiceRequest">The booking service request containing order details and service IDs.</param>
        /// <param name="accessToken">The access token of the user making the purchase.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains a <see cref="BookingServiceResponse"/> with purchase information.
        /// </returns>
        Task<BookingServiceResponse> AddPurchaseAsync(BookingServiceRequest bookingServiceRequest, string accessToken);
        Task<List<BookedService>> GetBookedService(string accountId);

        Task<List<BookedServiceListResponse>> GetBookedServicesForStaffAsync(Guid accountId, string? search, bool? isPaid);

        void RemoveUnpaidServicesAsync();

    }
}