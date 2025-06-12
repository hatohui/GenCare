using Domain.Entities;

namespace Application.Repositories;

public interface IAccountRepository
{
    Task<Account?> GetByEmailAsync(string email);

    Task AddAsync(Account user);

    Task<Account?> GetAccountByIdAsync(Guid id);

    Task<Account?> GetAccountByEmailPasswordAsync(string email, string password);

    Task UpdateAccount(Account user);

    Task<Account?> DeleteAccountByAccountId(Guid userId);

    Task<List<Account>> GetAccountsByPageAsync(int skip, int take, string? search, string? role, bool? active);

    Task<int> GetTotalAccountCountAsync(string? search, string? role, bool? active);
}