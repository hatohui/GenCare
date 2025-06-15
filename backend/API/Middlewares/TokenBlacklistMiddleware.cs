using Application.Helpers;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace API.Middlewares;

/// <summary>
/// Middleware to block requests with access tokens that are blacklisted in Redis.
/// </summary>
/// <param name="next">The next middleware in the pipeline.</param>
/// <param name="logger">The logger for logging Redis issues.</param>
public class TokenBlacklistMiddleware(RequestDelegate next, ILogger<TokenBlacklistMiddleware> logger)
{
    /// <summary>
    /// Middleware logic to inspect access token and reject if blacklisted.
    /// </summary>
    /// <param name="context">The current HTTP context.</param>
    /// <param name="cache">Injected Redis distributed cache.</param>
    public async Task InvokeAsync(HttpContext context, IDistributedCache cache)
    {
        var accessToken = AuthHelper.GetAccessToken(context);

        if (!string.IsNullOrEmpty(accessToken))
        {
            var key = $"blacklist:{accessToken}";

            try
            {
                var isBlacklisted = await cache.GetStringAsync(key);
                if (!string.IsNullOrEmpty(isBlacklisted))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("Access token is blacklisted.");
                    return;
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Redis unavailable – skipping token blacklist check.");
                // Optional: fallback behavior or monitoring notification
            }
        }
        await next(context);
    }
}
