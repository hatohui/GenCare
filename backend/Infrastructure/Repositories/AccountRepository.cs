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
            .FirstOrDefaultAsync(a => a.Email.ToLower() == email.ToLower());
    }

    public async Task<Account?> GetAccountByIdAsync(Guid accountId)
    {
        return await dbContext.Accounts
            .Include(a => a.Role)
            .Include(a => a.StaffInfo)
            .FirstOrDefaultAsync(a => a.Id == accountId);
    }

    public async Task UpdateAccount(Account user)
    {
        dbContext.Accounts.Update(user);
        await dbContext.SaveChangesAsync();
    }

    public async Task<Account?> DeleteAccountByAccountId(Guid userId)
    {
        var account = await dbContext.Accounts
            .FirstOrDefaultAsync(a => a.Id == userId);

        if (account == null)
        {
            return null;
        }

        account.IsDeleted = true;

        dbContext.Accounts.Update(account);
        await dbContext.SaveChangesAsync();

        return account;
    }
    public async Task<List<Account>> GetAccountsByPageAsync(int skip, int pageSize, string? search, string? role, bool? active)
    {
        var query = dbContext.Accounts
            .Include(a => a.Role)
            .AsNoTracking()
            .AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
        {
            var loweredSearch = search.ToLower();
            query = query.Where(a =>
                a.Email.ToLower().Contains(loweredSearch) ||
                a.FirstName.ToLower().Contains(loweredSearch) ||
                a.LastName.ToLower().Contains(loweredSearch));
        }
        if (!string.IsNullOrWhiteSpace(role))
        {
            var loweredRole = role.ToLower();
            query = query.Where(a => a.Role.Name.ToLower().Contains(loweredRole));
        }
        if (active.HasValue)
        {
            query = query.Where(a => a.IsDeleted != active.Value);
        }
        return await query
            .OrderByDescending(a => a.UpdatedAt)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetTotalAccountCountAsync(string? search, string? role, bool? active)
    {
        var query = dbContext.Accounts.AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
        {
            var loweredSearch = search.ToLower();
            query = query.Where(a =>
                a.Email.ToLower().Contains(loweredSearch) ||
                a.FirstName.ToLower().Contains(loweredSearch) ||
                a.LastName.ToLower().Contains(loweredSearch));
        }
        if (!string.IsNullOrWhiteSpace(role))
        {
            var loweredRole = role.ToLower();
            query = query.Where(a => a.Role.Name.ToLower().Contains(loweredRole));
        }
        if (active.HasValue)
        {
            query = query.Where(a => a.IsDeleted != active.Value);
        }
        return await query.CountAsync();
    }
}