using Domain.Entities;

namespace Application.Repositories;

/// <summary>
/// Defines methods for managing refresh tokens in the data store.
/// </summary>
public interface IRefreshTokenRepository
{
    /// <summary>
    /// Retrieves a refresh token associated with the specified account ID.
    /// </summary>
    /// <param name="accountId">The unique identifier of the account.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the <see cref="RefreshToken"/> if found; otherwise, <c>null</c>.
    /// </returns>
    Task<RefreshToken?> GetRefreshTokenByAccountIdAsync(Guid accountId);

    /// <summary>
    /// Adds a new refresh token to the data store.
    /// </summary>
    /// <param name="refreshToken">The refresh token to add.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task AddAsync(RefreshToken refreshToken);

    /// <summary>
    /// Retrieves a refresh token by its token string, if it exists and is not revoked.
    /// </summary>
    /// <param name="token">The token string to search for.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the <see cref="RefreshToken"/> if found; otherwise, <c>null</c>.
    /// </returns>
    Task<RefreshToken?> GetByTokenAsync(string token);

    /// <summary>
    /// Updates an existing refresh token in the data store.
    /// </summary>
    /// <param name="token">The refresh token to update.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task UpdateAsync(RefreshToken token);

    /// <summary>
    /// Deletes all revoked refresh tokens from the data store.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task DeleteRevokedTokensAsync();
}