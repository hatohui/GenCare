using Domain.Entities;

namespace Application.Repositories;

/// <summary>
/// Provides data access methods for purchase entities.
/// </summary>
public interface IPurchaseRepository
{
    /// <summary>
    /// Adds a new purchase to the data store.
    /// </summary>
    /// <param name="purchase">The purchase entity to add.</param>
    /// <returns>A task that represents the asynchronous add operation.</returns>
    Task AddAsync(Purchase purchase);
}