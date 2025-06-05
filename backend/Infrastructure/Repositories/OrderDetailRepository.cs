using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
}
