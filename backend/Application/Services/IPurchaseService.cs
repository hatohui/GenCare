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

        /// <summary>
        /// Retrieves a list of all booked services for a specific account ID.
        /// </summary>
        /// <param name="accountId">The ID of the account whose bookings should be retrieved.</param>
        /// <returns>A list of booked services associated with the specified account.</returns>
        /// <exception cref="AppException">Thrown if the account or purchases are not found.</exception>
        Task<List<BookedService>> GetBookedService(string accountId);

        /// <summary>
        /// Retrieves all booked services for a specific account, filtered optionally by purchase ID or payment status.
        /// This is intended for staff/admin viewing.
        /// </summary>
        /// <param name="accountId">The account ID of the user.</param>
        /// <param name="search">Optional search keyword (typically part of PurchaseId).</param>
        /// <param name="isPaid">Optional filter to get only paid or unpaid purchases.</param>
        /// <returns>A list of booked service responses for display in staff UI.</returns>
        Task<List<BookedServiceListResponse>> GetBookedServicesForStaffAsync(Guid accountId, string? search, bool? isPaid);

        /// <summary>
        /// Removes all unpaid purchases that are older than one week.
        /// </summary>
        void RemoveUnpaidServicesAsync();

    }
}