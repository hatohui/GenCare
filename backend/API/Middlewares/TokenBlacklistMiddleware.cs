using Application.Helpers;
using Microsoft.Extensions.Caching.Distributed;

namespace API.Middlewares;

public class TokenBlacklistMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, IDistributedCache cache)
    {
        var accessToken = AuthHelper.GetAccessToken(context);

        if (!string.IsNullOrEmpty(accessToken))
        {
            var key = $"blacklist:{accessToken}";
            var isBlacklisted = await cache.GetStringAsync(key);

            if (!string.IsNullOrEmpty(isBlacklisted))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Access token is  blacklisted.");
                return;
            }
        }

        await next(context);
    }
}