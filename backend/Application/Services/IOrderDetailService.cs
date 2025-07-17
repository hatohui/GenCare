namespace Application.Services;
public interface IOrderDetailService
{
    Task DeleteOrderDetail(string orderDetailId, string accountId);

}
