using Domain.Entities;

namespace Application.Repositories;

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

    Task<Account?> GetAccountByIdAsync(Guid id);

    Task<Account?> GetAccountByEmailPasswordAsync(string email, string password);

    /// <summary>
    /// Updates an existing account in the data store.
    /// </summary>
    /// <param name="user">The account entity with updated information.</param>
    Task UpdateAccount(Account user);

    Task<Account?> DeleteAccountByAccountId(Guid userId);

    Task<List<Account>> GetAccountsByPageAsync(int skip, int take, string? search, string? role, bool? active);

    Task<int> GetTotalAccountCountAsync(string? search, string? role, bool? active);
}