namespace Application.Services;

public interface IRefreshTokenService
{
    Task CleanupRevokedTokensAsync();
}