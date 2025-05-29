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

    public async Task<RefreshToken?> GetRefreshTokenByAccountIdAsync(Guid accountId)
    {
        throw new NotImplementedException();
    }

    public async Task<RefreshToken?> GetRefreshTokenByTokenAsync(string token)
    {
        throw new NotImplementedException();
    }
}