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
        //find account by email
        var account = await dbContext.Accounts.FirstOrDefaultAsync(u => email.ToLower() == u.Email.ToLower());

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