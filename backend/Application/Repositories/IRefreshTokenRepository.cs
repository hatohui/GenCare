using Domain.Entities;

namespace Application.Repositories;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetRefreshTokenByAccountIdAsync(Guid accountId);

    Task<RefreshToken?> GetRefreshTokenByTokenAsync(string token);

    Task AddAsync(RefreshToken refreshToken);

    Task<RefreshToken?> GetByTokenAsync(string token);

    Task UpdateAsync(RefreshToken token);
}