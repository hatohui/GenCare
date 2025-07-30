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

    /// <summary>
    /// Retrieves all purchases by a specific account ID.
    /// </summary>
    /// <param name="accountId">The account ID to filter purchases.</param>
    /// <returns>A list of purchases associated with the given account ID.</returns>
    Task<List<Purchase>> GetByAccountId(Guid accountId);

    /// <summary>
    /// Retrieves a single purchase by its ID.
    /// </summary>
    /// <param name="id">The ID of the purchase.</param>
    /// <returns>The purchase entity if found; otherwise, null.</returns>
    Task<Purchase?> GetById(Guid id);

    /// <summary>
    /// Updates an existing purchase in the database.
    /// </summary>
    /// <param name="purchase">The purchase entity to update.</param>
    Task Update(Purchase purchase);

    /// <summary>
    /// Deletes a purchase from the database.
    /// </summary>
    /// <param name="purchase">The purchase entity to delete.</param>
    Task Delete(Purchase purchase);

    /// <summary>
    /// Retrieves all purchases including their order details.
    /// </summary>
    /// <returns>A list of all purchases with related order details.</returns>
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