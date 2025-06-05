using Application.DTOs.Purchase.Request;
using Application.DTOs.Purchase.Response;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;

public class PurchaseService
(
    IPurchaseRepository purchaseRepository,
    IOrderDetailRepository orderDetailRepository,
    IAccountRepository accountRepository,
    IServiceRepository serviceRepository
) : IPurchaseService
{
    //add new purchase
    public async Task<BookingServiceResponse> AddPurchaseAsync(BookingServiceRequest bookingServiceRequest, string accessToken)
    {
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken1(accessToken);
        //get account by id
        var account = await accountRepository.GetAccountByIdAsync(accountId) ?? throw new AppException(404, "Account not found");
        //create purchase
        var purchase = new Purchase
        {
            AccountId = accountId,
            Account = account
        };

        //add purchase to database
        await purchaseRepository.AddAsync(purchase);

        ////for each order detail in booking service request
        //bookingServiceRequest.OrderDetails.ForEach(async o =>
        //{
        //    //create new order detail (DB)
        //    OrderDetail ordDetail = new()
        //    {
        //        PurchaseId = purchase.Id,
        //        ServiceId = o.ServiceId,
        //        FirstName = o.FirstName ?? "", //if first name is null --> assigned empty string
        //        LastName = o.LastName ?? "",
        //        Phone = o.PhoneNumber ?? "",
        //        DateOfBirth = o.DateOfBirth,
        //        Gender = o.Gender,
        //        Purchase = purchase,
        //        Service = await serviceRepository.GetByIdAsync(o.ServiceId)
        //                    ?? throw new Exception("Service not found")
        //    };
        //    //add order detail to corresponding purchase
        //    purchase.OrderDetail.Add(ordDetail);
        //    //add order detail to database
        //    await orderDetailRepository.AddAsync(ordDetail);
        //});

        //for each order detail in booking service request
        foreach (var o in bookingServiceRequest.OrderDetails)
        {
            //create new order detail (DB)
            OrderDetail ordDetail = new()
            {
                PurchaseId = purchase.Id,
                ServiceId = o.ServiceId,
                FirstName = o.FirstName ?? "",
                LastName = o.LastName ?? "",
                Phone = o.PhoneNumber ?? "",
                DateOfBirth = o.DateOfBirth,
                Gender = o.Gender,
                Purchase = purchase,
                Service = await serviceRepository.SearchServiceByIdAsync(o.ServiceId)
                          ?? throw new Exception("Service not found")
            };
            //add order detail to corresponding purchase
            purchase.OrderDetails.Add(ordDetail);
            //add order detail to database
            await orderDetailRepository.AddAsync(ordDetail);
        }

        return new BookingServiceResponse
        {
            message = "Booking successful"
        };
    }
}