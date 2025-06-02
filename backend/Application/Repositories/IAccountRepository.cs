using Domain.Entities;

namespace Application.Repositories;

public interface IAccountRepository
{
    Task<Account?> GetByEmailAsync(string email);
    Task AddAsync(Account user);
    Task<Account?> GetAccountByEmailPasswordAsync(string email, string password);
    Task<Account?> GetByAccountIdAsync(Guid accountId);
}