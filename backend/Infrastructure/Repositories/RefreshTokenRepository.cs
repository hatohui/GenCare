using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class RefreshTokenRepository(IApplicationDbContext context) : IRefreshTokenRepository
{
    public async Task AddAsync(RefreshToken refreshToken)
    {
        await context.RefreshTokens.AddAsync(refreshToken);
        await context.SaveChangesAsync();
    }

    public Task<RefreshToken?> GetRefreshTokenByAccountIdAsync(Guid accountId)
    {
        throw new NotImplementedException();
    }

    public async Task<RefreshToken?> GetByTokenAsync(string token)
    {
        return await context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token && !rt.IsRevoked);
    }

    public async Task UpdateAsync(RefreshToken token)
    {
        context.RefreshTokens.Update(token);
        await context.SaveChangesAsync();
    }

    public async Task DeleteRevokedTokensAsync()
    {
        await context.RefreshTokens.Where(x => x.IsRevoked).ExecuteDeleteAsync();
    }
}