using Application.Repositories;
using Application.Services;

namespace Infrastructure.Services;

public class RefreshTokenService(IRefreshTokenRepository repository) : IRefreshTokenService
{
    public async Task CleanupRevokedTokensAsync()
    {
        await repository.DeleteRevokedTokensAsync();
    }
}