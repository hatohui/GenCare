using Domain.Entities;

namespace Application.Repositories;

public interface IAccountRepository
{
    Task<Account?> GetByEmailAsync(string email);

    Task AddAsync(Account user);
    
    Task<Account?> GetByAccountIdAsync(Guid id);

    Task<Account?> GetAccountByEmailPasswordAsync(string email, string password);

    Task<List<Account>> GetAccountsByPageAsync(int skip, int take);

    Task UpdateAccount(Account user);
    Task<Account?> DeleteAccountByAccountId(Guid userId);
}

