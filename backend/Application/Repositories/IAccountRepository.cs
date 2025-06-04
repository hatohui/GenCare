using Domain.Entities;

namespace Application.Repositories;

public interface IAccountRepository
{
    Task<Account?> GetByEmailAsync(string email);

    Task<Account?> GetByAccountIdAsync(Guid id);

    Task AddAsync(Account user);

    Task<Account?> GetAccountByEmailPasswordAsync(string email, string password);

    Task UpdateAccount(Account user);
}
