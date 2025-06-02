using Application.Helpers;
using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class AccountRepository(IApplicationDbContext dbContext) : IAccountRepository
{
    public async Task AddAsync(Account user)
    {
        await dbContext.Accounts.AddAsync(user);
        await dbContext.SaveChangesAsync();
    }

    public async Task<Account?> GetAccountByEmailPasswordAsync(string email, string password)
    {
        //find account by email
        var account = await dbContext
            .Accounts.Include(u => u.Role)
            .FirstOrDefaultAsync(u => email.ToLower() == u.Email.ToLower());

        if (account == null || !PasswordHasher.Verify(password, account.PasswordHash))
        {
            return null;
        }
        return account;
    }

    public async Task<Account?> GetByEmailAsync(string email)
    {
        return await dbContext.Accounts.Include(a => a.Role)
            .FirstOrDefaultAsync(a => a.Email == email);
    }

    public async Task<Account?> GetByAccountIdAsync(Guid accountId)
    {
        return await dbContext.Accounts
            .Include(a => a.Role)
            .Include(a => a.BirthControl)
            .FirstOrDefaultAsync(a => a.Id == accountId);
    }

    public async Task<Account?> GetByIdAsync(Guid id)
    {
        return await dbContext.Accounts.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
    }
}
