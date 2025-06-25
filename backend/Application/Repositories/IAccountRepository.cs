using Domain.Entities;

namespace Application.Repositories;

/// <summary>
/// Represents the repository interface for managing account-related operations.
/// </summary>
public interface IAccountRepository
{
    /// <summary>
    /// Retrieves an account by email address.
    /// </summary>
    /// <param name="email">The email address of the account.</param>
    /// <returns>The account if found; otherwise, null.</returns>
    Task<Account?> GetByEmailAsync(string email);

    /// <summary>
    /// Adds a new account to the data store.
    /// </summary>
    /// <param name="user">The account entity to add.</param>
    Task AddAsync(Account user);

    /// <summary>
    /// Retrieves an account by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the account.</param>
    /// <returns>The account associated with the given ID, or null if not found.</returns>
    Task<Account?> GetAccountByIdAsync(Guid id);

    /// <summary>
    /// Retrieves an account by its email and password.
    /// </summary>
    /// <param name="email">The email address of the account.</param>
    /// <param name="password">The password of the account.</param>
    /// <returns>The account if the email and password match, or null if not found.</returns>
    Task<Account?> GetAccountByEmailPasswordAsync(string email, string password);

    /// <summary>
    /// Updates an existing account in the data store.
    /// </summary>
    /// <param name="user">The account entity with updated information.</param>
    Task UpdateAccount(Account user);

    /// <summary>
    /// Marks an account as deleted by its unique identifier.
    /// </summary>
    /// <param name="userId">The unique identifier of the account to be deleted.</param>
    /// <returns>The updated account entity, or null if not found.</returns>
    Task<Account?> DeleteAccountByAccountId(Guid userId);

    /// <summary>
    /// Retrieves a paginated list of accounts based on search criteria.
    /// </summary>
    /// <param name="skip">The number of accounts to skip.</param>
    /// <param name="take">The number of accounts to retrieve.</param>
    /// <param name="search">The search term for filtering accounts.</param>
    /// <param name="role">The role name for filtering accounts.</param>
    /// <param name="active">The active status for filtering accounts.</param>
    /// <returns>A list of accounts matching the criteria.</returns>
    Task<List<Account>> GetAccountsByPageAsync(int skip, int take, string? search, string? role, bool? active);

    /// <summary>
    /// Retrieves the total count of accounts based on search criteria.
    /// </summary>
    /// <param name="search">The search term for filtering accounts.</param>
    /// <param name="role">The role name for filtering accounts.</param>
    /// <param name="active">The active status for filtering accounts.</param>
    /// <returns>The total count of accounts matching the criteria.</returns>
    Task<int> GetTotalAccountCountAsync(string? search, string? role, bool? active);

    Task<List<Account>> GetAll();
}