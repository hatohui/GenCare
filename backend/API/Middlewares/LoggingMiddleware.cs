using System.Diagnostics;

namespace API.Middlewares;

/// <summary>
/// Middleware that logs details of incoming HTTP requests and outgoing responses,
/// including method, path, client IP, and elapsed processing time.
/// If debug logging is enabled, it also logs the Bearer access token if available.
/// </summary>
/// <param name="next">The next middleware in the HTTP request pipeline.</param>
/// <param name="logger">The logger used to record diagnostic messages.</param>
public class LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
{
    /// <summary>
    /// Processes the HTTP request and logs method, path, IP address, status code, and duration.
    /// </summary>
    /// <param name="context">The current HTTP context.</param>
    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();

        var method = Sanitize(context.Request.Method);
        var path = Sanitize(context.Request.Path.Value ?? string.Empty);
        var ip = Sanitize(context.Connection.RemoteIpAddress?.ToString() ?? "Unknown");

        logger.LogTrace("📍 Entering LoggingMiddleware - {Method} {Path} from {IP}", method, path, ip);
        logger.LogInformation("➡️ HTTP {Method} {Path} from {IP}", method, path, ip);

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

            if (context.Response.StatusCode is >= 400 and < 500)
            {
                logger.LogWarning("⚠️ HTTP {StatusCode} for {Method} {Path}", context.Response.StatusCode, method, path);
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
            logger.LogInformation("✅ HTTP {StatusCode} {Method} {Path} in {Elapsed}ms", statusCode, method, path, sw.ElapsedMilliseconds);
        }
    }

    /// <summary>
    /// Removes newline characters from input strings to ensure clean log formatting.
    /// </summary>
    /// <param name="input">The raw input string.</param>
    /// <returns>A sanitized version of the input.</returns>
    private static string Sanitize(string input)
    {
        return input.Replace("\r", "").Replace("\n", "");
    }
}