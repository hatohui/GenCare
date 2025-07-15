using Application.DTOs.Payment.ManualPayment.Request;
using Application.DTOs.Payment.ManualPayment.Response;
using Application.Helpers;
using Application.Repositories;
using Domain.Common.Constants;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;

public class ManualPaymentService(
    IPurchaseRepository purchaseRepository,
    IOrderDetailRepository orderDetailRepository,
    IServiceRepository serviceRepository,
    IPaymentHistoryRepository paymentHistoryRepository,
    IResultRepository resultRepository
    ) : IManualPaymentService
{
    private static DateTime ToUnspecified(DateTime dt)
    {
        return DateTime.SpecifyKind(dt, DateTimeKind.Unspecified);
    }

    public async Task<ConfirmPaymentByStaffResponse> ConfirmAsync(ConfirmPaymentByStaffRequest request)
    {
        var purchase = await purchaseRepository.GetById(request.PurchaseId) ??
                       throw new InvalidOperationException("Purchase not found.");
        var existingPayment = await paymentHistoryRepository.GetById(request.PurchaseId);

        // Check if payment already paid

        if (existingPayment is not null && existingPayment.Status == PaymentStatus.Paid)
            throw new AppException(400, "Payment already paid.");

        //get order detail by purchase id
        var orderDetails = await orderDetailRepository.GetByPurchaseIdAsync(request.PurchaseId);
        if (orderDetails is null)
            throw new AppException(404, "Order detail not found.");

        //Get all different service IDs from the order details of this purchase
        var serviceIds = await orderDetailRepository.GetDistinctServiceIdsByPurchaseIdAsync(purchase.Id);

        var services = await serviceRepository.GetByIdsAsync(serviceIds);
        
        var servicePriceDict = services.ToDictionary(s => s.Id, s => s.Price);

        //calculate total amount
        var totalAmount = orderDetails.Sum(od => servicePriceDict[od.ServiceId]);

        // var payment = new PaymentHistory()
        // {
        //     PurchaseId = purchase.Id,
        //     CreatedAt = ToUnspecified(DateTime.Now),
        //     TransactionId = CreateRandomTransaction.GenerateRandomString(10),
        //     Amount = totalAmount,
        //     Status = PaymentStatus.Paid,
        //     PaymentMethod = PaymentMethod.Cash,
        //     ExpiredAt = ToUnspecified(DateTime.Now.AddDays(7)),
        //     
        // };
        // await paymentHistoryRepository.Add(payment);
        //change flow set status of payment to paid not create payment history
        existingPayment!.Status = PaymentStatus.Paid;
        existingPayment.TransactionId = CreateRandomTransaction.GenerateRandomString(10);
        existingPayment.Amount = totalAmount;
        existingPayment.ExpiredAt = ToUnspecified(DateTime.Now.AddDays(7));
        existingPayment.PaymentMethod = PaymentMethod.Cash;
        
        await paymentHistoryRepository.UpdateAsync(existingPayment);
        // Create result for each order detail
        foreach (var orderDetail in orderDetails)
        {
            var result = new Result
            {
                OrderDetailId = orderDetail.Id,
                OrderDate = ToUnspecified(DateTime.Now),
                // Các giá trị còn lại (sample/result/status/resultData) để staff nhập sau
                SampleDate = null,
                ResultDate = null,
                Status = false,
                ResultData = null,
                UpdatedAt = ToUnspecified(DateTime.Now)
            };

            await resultRepository.AddAsync(result);
        }
        return new ConfirmPaymentByStaffResponse()
        {
            Success = true,
            Message = "Payment successfully confirmed. Thank you for your prompt action.",
           
        };
    }
}