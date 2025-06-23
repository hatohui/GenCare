using Application.DTOs.Purchase.Request;
using Application.DTOs.Purchase.Response;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Common.Enums;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;

public class PurchaseService
(
    IPurchaseRepository purchaseRepository,
    IAccountRepository accountRepository,
    IServiceRepository serviceRepository
) : IPurchaseService
{
    //add new purchase
    public async Task<BookingServiceResponse> AddPurchaseAsync(BookingServiceRequest bookingServiceRequest, string accessToken)
    {
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken);
        //get account by id
        var account = await accountRepository.GetAccountByIdAsync(accountId) ?? throw new Exception("Account not found");
        //create purchase
        var purchase = new Purchase
        {
            Account = account,
            CreatedBy = accountId
        };
        decimal totalPrice = 0;
        //for each order detail in booking service request
        foreach (var o in bookingServiceRequest.OrderDetails!)
        {
            var ser = await serviceRepository.SearchServiceByIdAsync(o.ServiceId);
            if (ser == null)
                throw new AppException(404, $"Service with ID {o.ServiceId} not found");
            //calculate total price
            totalPrice += ser.Price;
            //create new order detail
            OrderDetail ordDetail = new()
            {
                FirstName = o.FirstName ?? "",
                LastName = o.LastName ?? "",
                Phone = o.PhoneNumber ?? "",
                DateOfBirth = o.DateOfBirth,
                Gender = o.Gender,
                Service = await serviceRepository.SearchServiceByIdAsync(o.ServiceId)
                            ?? throw new Exception("Service not found")
            };
            //add order detail to corresponding purchase
            purchase.OrderDetails.Add(ordDetail);
        }
        ////create paymentHistory for purchase
        //var paymentHistory = new PaymentHistory
        //{
        //    Purchase = purchase,
        //    TransactionId = Guid.NewGuid(),
        //    Amount = totalPrice,
        //    CreatedAt = DateTime.Now,
        //    PaymentMethod = ,
        //    Status = PaymentHistoryStatus.Pending
        //};
        //purchase.PaymentHistory = paymentHistory;
        await purchaseRepository.AddAsync(purchase);

        return new BookingServiceResponse
        {
            message = "Booking successful"
        };
    }

    //get booked services by account id
    public async Task<List<BookedService>> GetBookedService(string accountId)
    {
        //get account by id
        var account = await accountRepository.GetAccountByIdAsync(Guid.Parse(accountId));
        if (account == null)
            throw new AppException(404, "account not found");
        //get purchases by account id
        var purchases = await purchaseRepository.GetByAccountId(account.Id);
        if (purchases == null || purchases.Count == 0)
            throw new AppException(404, "No purchases found for this account");
        //map all order details in purchases to BookedService list
        List<BookedService> rs = new();
        foreach(var purchase in purchases)
        {
            var orderDetails = purchase.OrderDetails;
            if (orderDetails == null || orderDetails.Count == 0)
                throw new AppException(404, "No order details found for this account");
            foreach (var orderDetail in orderDetails)
            {
                //find service by id
                var service = await serviceRepository.SearchServiceByIdAsync(orderDetail.ServiceId);
                rs.Add(new BookedService()
                {
                    OrderDetailId = orderDetail.Id.ToString("D"),
                    PurchaseId = purchase.Id.ToString("D"),
                    ServiceName = service?.Name ?? "Unknown Service",
                    FirstName = orderDetail.FirstName,
                    LastName = orderDetail.LastName,
                    PhoneNumber = orderDetail.Phone,                    
                    DateOfBirth = orderDetail.DateOfBirth,
                    Gender = orderDetail.Gender,
                    CreatedAt = purchase.CreatedAt
                });
            }
        }
        return rs;
    }

}