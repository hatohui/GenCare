
using Application.Repositories;
using Application.Services;
using Domain.Exceptions;

namespace Infrastructure.Services;
public class OrderDetailService(IOrderDetailRepository orderDetailRepository,
                                IPurchaseRepository purchaseRepository,
                                IPaymentHistoryRepository paymentHistoryRepository,
                                ITestTrackerRepository testTrackerRepository) : IOrderDetailService
{
    public async Task DeleteOrderDetail(string orderDetailId, string accountId)
    {
        //get order detail by id
        var orderDetail = await orderDetailRepository.GetByIdAsync(Guid.Parse(orderDetailId));
        if (orderDetail is null)
            throw new AppException(404, "Order detail not found");

        //get purchase by account id
        var purchases = await purchaseRepository.GetByAccountId(Guid.Parse(accountId));
        if (purchases is null || purchases.Count == 0)
            throw new AppException(403, "You are not allowed to delete this order detail");
        
        //check if order detail belongs to the account
        if (!purchases.Any(p => p.Id == orderDetail.PurchaseId))
            throw new AppException(403, "You are not allowed to delete this order detail");
        
        //if payment history of the order detail does not exist, delete the order detail
        //if exists, block deletion
        var payment = await paymentHistoryRepository.GetById(orderDetail.PurchaseId);
        if(payment is not null)
            throw new AppException(400, "You are not allowed to delete this order detail because this order is paid");

        //check if result of order detail exists?
        //if exists, block deletion
        var resultTest = await testTrackerRepository.ViewTestTrackerAsync(orderDetail.Id);
        if (resultTest is not null)
            throw new AppException(400, "You are not allowed to delete this order detail because test result exists");

        //now can delete order detail
        await orderDetailRepository.Delete(orderDetail);
    }
}
