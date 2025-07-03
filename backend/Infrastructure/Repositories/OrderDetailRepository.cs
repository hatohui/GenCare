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

    public async Task Delete(OrderDetail orderDetail)
    {
        dbContext.OrderDetails.Remove(orderDetail);
        await dbContext.SaveChangesAsync();
    }

    public async Task<List<OrderDetail>> GetAll()
    {
        return await dbContext.OrderDetails
            .ToListAsync();
    }

    public async Task<OrderDetail?> GetByIdAsync(Guid orderDetailId) 
        => await dbContext.OrderDetails.Include(od => od.Purchase).FirstOrDefaultAsync(od => od.Id == orderDetailId);

    public async Task<List<OrderDetail>> GetByPurchaseIdAsync(Guid purchaseId)
    {
        return await dbContext.OrderDetails
            .Where(od => od.PurchaseId == purchaseId )
            .ToListAsync();
    }
    public async Task<List<Guid>> GetDistinctServiceIdsByPurchaseIdAsync(Guid purchaseId)
        =>await dbContext.OrderDetails
            .Where(od => od.PurchaseId == purchaseId)
            .Select(od => od.ServiceId)
            .Distinct()
            .ToListAsync();

    
}