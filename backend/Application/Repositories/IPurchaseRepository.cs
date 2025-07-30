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
    Task<List<Purchase>> GetByAccountId(Guid accountId);
    Task<Purchase?> GetById(Guid id);
    Task Update(Purchase purchase);
    Task Delete(Purchase purchase);
    Task<List<Purchase>> GetAllPurchasesAsync();
    /// <summary>
    /// Removes all purchases that are still pending payment and were created more than one week ago.
    /// </summary>
    /// <remarks>
    /// This method queries the database for purchases where the payment status is <c>Pending</c>
    /// and the purchase was created more than 7 days ago. It then deletes those purchases from the database,
    /// including their related order details and payment history if cascade delete is configured.
    /// </remarks>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task RemoveUnpaidPurchasesAsync();
}