using Application.DTOs.Payment.ManualPayment.Request;
using Application.DTOs.Payment.ManualPayment.Response;
using Application.Repositories;
using Domain.Common.Constants;
using Domain.Exceptions;

namespace Infrastructure.Services;

public class ManualPaymentService(
    IPurchaseRepository purchaseRepository,
    IOrderDetailRepository orderDetailRepository,
    IServiceRepository serviceRepository,
    IPaymentHistoryRepository paymentHistoryRepository) : IManualPaymentService
{
    public async Task<ConfirmPaymentByStaffResponse> ConfirmAsync(ConfirmPaymentByStaffRequest request)
    {
        var purchase = await purchaseRepository.GetById(request.PurchaseId) ??
                       throw new InvalidOperationException("Purchase not found.");
        var existingPayment = await paymentHistoryRepository.GetById(request.PurchaseId);
        
        // Check if payment already paid
        
        if(existingPayment is not null && existingPayment.Status == PaymentStatus.Paid)
            throw new AppException(400,"Payment already paid.");
        
        //get order detail by purchase id
        var orderDetails = await orderDetailRepository.GetByIdAsync(request.PurchaseId);
        if(orderDetails is null)
            throw new AppException(404, "Order detail not found.");
        
        //get service by order detail
        return ConfirmPaymentByStaffResponse
        {
            // PurchaseId = purchase.Id,
            // TransactionId = Guid.NewGuid(),
            // Amount = orderDetails.Price,
            // PaymentMethod = request.PaymentMethod,
            // Status = PaymentStatus.Paid,
            // CreatedAt = DateTime.UtcNow,
            // ExpiredAt = null // Manual payment does not expire
        };

    }
}