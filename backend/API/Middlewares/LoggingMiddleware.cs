using System.Diagnostics;

namespace API.Middlewares;

public class LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();

        var method = Sanitize(context.Request.Method);
        var path = Sanitize(context.Request.Path.Value ?? "");
        var ip = Sanitize(context.Connection.RemoteIpAddress?.ToString() ?? "Unknown");
        logger.LogTrace("📍 Entering LoggingMiddleware - {Method} {Path} from {IP}", method, path, ip);
        logger.LogInformation("➡️ {Method} {Path} from {IP}", method, path, ip);
        if (logger.IsEnabled(LogLevel.Debug))
        {
            var authHeader = context.Request.Headers.Authorization.ToString();
            if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                var token = Sanitize(authHeader["Bearer ".Length..].Trim());
                logger.LogDebug("🔐 Access Token: {Token}", token);
            }
        }
        try
        {
            await next(context);
            if (context.Response.StatusCode >= 400 && context.Response.StatusCode < 500)
            {
                logger.LogWarning("⚠️ {StatusCode} returned for {Method} {Path}", context.Response.StatusCode, method, path);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "❌ Error while handling {Method} {Path} from {IP}", method, path, ip);
            logger.LogCritical("🔥 Critical failure during {Method} {Path} from {IP}", method, path, ip);
            throw;
        }
        finally
        {
            sw.Stop();
            var statusCode = context.Response.StatusCode;
            logger.LogTrace("📤 Exiting LoggingMiddleware - Took {Elapsed}ms", sw.ElapsedMilliseconds);
            logger.LogInformation("✅ {StatusCode} {Method} {Path} in {Elapsed}ms", statusCode, method, path, sw.ElapsedMilliseconds);
        }
    }
    private static string Sanitize(string input)
    {
        return input.Replace("\r", "").Replace("\n", "");
    }
}
