namespace Application.Services;
/// <summary>
/// Service for handling refresh token related operations.
/// </summary>
/// <remarks>
/// This service provides methods to manage refresh tokens, such as cleaning up revoked tokens.
/// </remarks>
public interface IRefreshTokenService
{
    /// <summary>
    /// Removes all revoked refresh tokens from the repository asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous cleanup operation.</returns>
    Task CleanupRevokedTokensAsync();
}