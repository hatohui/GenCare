using System.Diagnostics;

namespace API.Middlewares;

public class LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();
        var timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff");

        var request = context.Request;

        var sanitizedMethod = request.Method.Replace("\n", "").Replace("\r", "");
        var sanitizedPath = request.Path.Value?.Replace("\n", "").Replace("\r", "") ?? string.Empty;
        var sanitizedIP = context.Connection.RemoteIpAddress?.ToString().Replace("\n", "").Replace("\r", "") ?? "Unknown";

        logger.LogInformation("🕓 [{Time}] ➡️ HTTP {Method} {Path} from {IP}",
            timestamp, sanitizedMethod, sanitizedPath, sanitizedIP);

        await next(context);

        sw.Stop();

        var response = context.Response;

        logger.LogInformation("🕓 [{Time}] ✅ HTTP {StatusCode} for {Method} {Path} in {Elapsed}ms",
            timestamp, response.StatusCode, sanitizedMethod, sanitizedPath, sw.ElapsedMilliseconds);
    }
}