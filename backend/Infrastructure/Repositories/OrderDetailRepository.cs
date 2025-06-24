using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class OrderDetailRepository(IApplicationDbContext dbContext) : IOrderDetailRepository
{
    public async Task AddAsync(OrderDetail orderDetail)
    {
        await dbContext.OrderDetails.AddAsync(orderDetail);
        await dbContext.SaveChangesAsync();
    }

    public async Task<OrderDetail?> GetByIdAsync(Guid orderDetailId) 
        => await dbContext.OrderDetails.Include(od => od.Purchase).FirstOrDefaultAsync(od => od.Id == orderDetailId);
        
    
}