using Domain.Entities;

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
}