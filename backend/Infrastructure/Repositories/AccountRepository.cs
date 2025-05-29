using Application.Helpers;
using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;
using Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class AccountRepository(IApplicationDbContext dbContext) : IAccountRepository
{
    public async Task<Account?> GetAccountByEmailPasswordAsync(string email, string password)
    {
        var account = await dbContext.Accounts
            .Include(a => a.Role)
            .FirstOrDefaultAsync(a => a.Email == email);
        
        if (account == null || !PasswordHasher.Verify(password, account.PasswordHash))
        {
            return null;
        }
        return account;   
            
    }
}