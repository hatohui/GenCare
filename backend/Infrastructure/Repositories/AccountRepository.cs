using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;
using Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class AccountRepository(IApplicationDbContext context) : IAccountRepository
{

    public async Task AddAsync(Account user)
    {
        await context.Accounts.AddAsync(user);
        await context.SaveChangesAsync();
    }

    public async Task<Account?> GetByEmailAsync(string email)
    {
        return await context.Accounts.FirstOrDefaultAsync(u => u.Email == email);
    }
}