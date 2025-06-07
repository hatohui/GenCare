using Domain.Entities;

namespace Application.Repositories;

public interface IOrderDetailRepository
{
    Task AddAsync(OrderDetail orderDetail);
}