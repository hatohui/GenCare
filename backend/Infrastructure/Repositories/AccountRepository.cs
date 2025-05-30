using Application.Helpers;
using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class AccountRepository(IApplicationDbContext dbContext) : IAccountRepository
{
    public Task AddAsync(Account user)
    {
        throw new NotImplementedException();
    }

    public async Task<Account?> GetAccountByEmailPasswordAsync(string email, string password)
    {
        var account = await dbContext.Accounts
            .Include(a => a.Role)
            .FirstOrDefaultAsync(a => string.Equals(a.Email, email, StringComparison.OrdinalIgnoreCase));

        if (account == null || !PasswordHasher.Verify(password, account.PasswordHash))
        {
            return null;
        }
        return account;
    }

    public async Task<Account?> GetByEmailAsync(string email)
    {
        return await dbContext.Accounts.FirstOrDefaultAsync(u => string.Equals(u.Email, email, StringComparison.OrdinalIgnoreCase));
    }
}