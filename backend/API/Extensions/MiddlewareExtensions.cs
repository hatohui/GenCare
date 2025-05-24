using API.Middlewares;
using Web.Middlewares;

namespace API.Extensions;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseRateLimit(this IApplicationBuilder app)
    {
        return app.UseMiddleware<RateLimitMiddleware>();
    }

    public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder app)
    {
        return app.UseMiddleware<GlobalExceptionMiddleware>();
    }

    public static IApplicationBuilder UseLogging(this IApplicationBuilder app)
    {
        return app.UseMiddleware<LoggingMiddleware>();
    }
}