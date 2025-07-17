
using Application.Repositories;
using Application.Services;
using Domain.Common.Constants;
using Domain.Exceptions;

namespace Infrastructure.Services;
public class OrderDetailService(IOrderDetailRepository orderDetailRepository,
                                IPurchaseRepository purchaseRepository,
                                IPaymentHistoryRepository paymentHistoryRepository,
                                IResultRepository resultRepository) : IOrderDetailService
{
    public async Task DeleteOrderDetail(string orderDetailId, string accountId)
    {
        //get order detail by id
        var orderDetail = await orderDetailRepository.GetByIdAsync(Guid.Parse(orderDetailId));
        if (orderDetail is null)
            throw new AppException(404, "Order detail not found");

        //get purchase by id
        var purchase = await purchaseRepository.GetById(orderDetail.PurchaseId);

        //check if purchase exists
        if (purchase is null)
            throw new AppException(404, "Purchase for this order detail is not found");

        //check if account id of purchase is the same as account id of order detail
        if (purchase.AccountId.ToString("D") != accountId)
            throw new AppException(403, "You are not allowed to delete this order detail because you are not the owner of this purchase");

        //thanh toán rồi thì không được xóa
        var payment = await paymentHistoryRepository.GetById(orderDetail.PurchaseId);
        if (payment is not null)
        {
            if(payment.Status.Trim().ToLower() == PaymentStatus.Paid.ToLower())
                throw new AppException(400, "You are not allowed to delete this order detail because this order is paid");
        }
        //check if result of order detail exists?
        //if exists, block deletion
        var resultTest = await resultRepository.ViewResultAsync(orderDetail.Id);
        if (resultTest is not null)
            throw new AppException(400, "You are not allowed to delete this order detail because test result exists");

        //check if purchase has only one order detail
        var tmp = false;
        if (purchase.OrderDetails.Count == 1)
        {
            //if purchase has only one order detail, set isEmpty to true
            tmp = true;
        }

        //now can delete order detail
        await orderDetailRepository.Delete(orderDetail);

        //after deleting order detail, check if purchase has no order details left
        //if purchase has no order details left, delete purchase
        if (tmp)
        {
            //xóa payment của purchase trước
            payment = await paymentHistoryRepository.GetById(purchase.Id);
            if (payment is not null)
            {
                await paymentHistoryRepository.Delete(payment);
            }
            await purchaseRepository.Delete(purchase);
        }
    }
}
