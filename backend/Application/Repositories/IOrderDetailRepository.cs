﻿using Domain.Entities;

namespace Application.Repositories;

/// <summary>
/// Provides data access methods for order detail entities.
/// </summary>
public interface IOrderDetailRepository
{
    /// <summary>
    /// Adds a new order detail to the data store.
    /// </summary>
    /// <param name="orderDetail">The order detail entity to add.</param>
    /// <returns>A task that represents the asynchronous add operation.</returns>
    Task AddAsync(OrderDetail orderDetail);


    Task<OrderDetail?> GetByIdAsync(Guid orderDetailId);

    Task<List<OrderDetail>> GetByPurchaseIdAsync(Guid purchaseId);

    Task<List<Guid>> GetDistinctServiceIdsByPurchaseIdAsync(Guid purchaseId);

    Task Delete(OrderDetail orderDetail);

    Task<List<OrderDetail>> GetAll();

    Task<OrderDetail?> GetOrderDetailWithResultAsync(Guid orderDetailId, CancellationToken cancellationToken = default);
}