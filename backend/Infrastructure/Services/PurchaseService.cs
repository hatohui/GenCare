using Application.DTOs.Purchase;
using Application.DTOs.Purchase.Request;
using Application.DTOs.Purchase.Response;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Common.Constants;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;

public class PurchaseService(
    IPurchaseRepository purchaseRepository,
    IAccountRepository accountRepository,
    IServiceRepository serviceRepository,
    IPaymentHistoryRepository paymentHistoryRepository
) : IPurchaseService
{
    //add new purchase
    public async Task<BookingServiceResponse> AddPurchaseAsync(BookingServiceRequest bookingServiceRequest,
        string accessToken)
    {
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken);
        //get account by id
        var account = await accountRepository.GetAccountByIdAsync(accountId) ??
                      throw new Exception("Account not found");
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
            var ser = await serviceRepository.SearchServiceByIdAsync(o.ServiceId) ?? throw new AppException(404, $"Service with ID {o.ServiceId} not found");
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
        //tạo payment history cho purchase
        PaymentHistory payHis = new()
        {
            TransactionId = null,
            CreatedAt = DateTime.Now,
            Amount = totalPrice,
            Status = PaymentStatus.Pending,
            PaymentMethod = PaymentMethod.Bank,
            PayId = null
        };

        purchase.PaymentHistory = payHis;
        await purchaseRepository.AddAsync(purchase);

        return new BookingServiceResponse
        {
            PurchaseId = purchase.Id.ToString("D"),
        };
    }

    //get booked services by account id
    public async Task<List<BookedService>> GetBookedService(string accountId)
    {
        //get account by id
        var account = await accountRepository.GetAccountByIdAsync(Guid.Parse(accountId)) ?? throw new AppException(404, "account not found");
        //get purchases by account id
        var purchases = await purchaseRepository.GetByAccountId(account.Id);
        if (purchases == null || purchases.Count == 0)
            throw new AppException(404, "No purchases found for this account");
        //map all order details in purchases to BookedService list
        List<BookedService> rs = [];
        foreach (var purchase in purchases)
        {
            //kiểm tra trạng thái payment history
            var paid = false;
            var paymentHistory = await paymentHistoryRepository.GetById(purchase.Id);
            if (paymentHistory != null)
            {
                if (paymentHistory!.Status.Trim().Equals(PaymentStatus.Paid, StringComparison.CurrentCultureIgnoreCase))
                    paid = true;
                //get order details of this purchase
                var orderDetails = purchase.OrderDetails;
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
                        CreatedAt = purchase.CreatedAt,
                        Status = paid
                    });
                }
            }
        }

        return rs;
    }

    public async Task<List<BookedServiceListResponse>> GetBookedServicesForStaffAsync(
      Guid accountId,
      string? search,
      bool? isPaid)
    {
        var purchases = await purchaseRepository.GetByAccountId(accountId);
        var result = new List<BookedServiceListResponse>();

        foreach (var purchase in purchases)
        {
            if (!string.IsNullOrWhiteSpace(search))
            {
                if (!purchase.Id.ToString().Contains(search, StringComparison.OrdinalIgnoreCase))
                    continue;
            }
            else if (isPaid.HasValue)
            {
                var payment = await paymentHistoryRepository.GetById(purchase.Id);
                var status = payment?.Status?.Trim(); // Thêm .Trim()

                if (isPaid.Value)
                {
                    // Sử dụng PaymentStatus.Paid thay vì "paid"
                    if (!string.Equals(status, PaymentStatus.Paid, StringComparison.OrdinalIgnoreCase))
                        continue;
                }
                else
                {
                    if (string.Equals(status, PaymentStatus.Paid, StringComparison.OrdinalIgnoreCase))
                        continue;
                }
            }

            var responseItem = new BookedServiceListResponse
            {
                PurchaseId = purchase.Id.ToString(),
                IsPaid = false,
                Price = 0,
                Order = []
            };

            var paymentCheck = await paymentHistoryRepository.GetById(purchase.Id);
            responseItem.IsPaid = paymentCheck != null &&
                                  !string.IsNullOrEmpty(paymentCheck.Status) &&
                                  string.Equals(paymentCheck.Status.Trim(), PaymentStatus.Paid, StringComparison.OrdinalIgnoreCase);

            foreach (var od in purchase.OrderDetails)
            {
                var service = await serviceRepository.SearchServiceByIdAsync(od.ServiceId);
                if (service == null) continue;

                responseItem.Order.Add(new BookedServiceModel
                {
                    OrderDetailId = od.Id,
                    ServiceName = service.Name,
                    FirstName = od.FirstName,
                    LastName = od.LastName,
                    PhoneNumber = od.Phone,
                    DateOfBirth = od.DateOfBirth.ToDateTime(TimeOnly.FromDateTime(DateTime.Now)),
                    Gender = od.Gender,
                    CreatedAt = purchase.CreatedAt,
                });

                responseItem.Price += service.Price;
            }

            if (responseItem.Order.Count != 0)
                result.Add(responseItem);
        }

        return result;
    }

    public async Task RemoveUnpaidServicesAsync()
    {
        await purchaseRepository.RemoveUnpaidPurchasesAsync();
    }

}