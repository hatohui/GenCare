using System.Diagnostics;

namespace API.Middlewares;

public class LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();

        var request = context.Request;

        var sanitizedMethod = request.Method.Replace("\n", "").Replace("\r", "");
        var sanitizedPath = request.Path.Value?.Replace("\n", "").Replace("\r", "") ?? string.Empty;
        var sanitizedIP = context.Connection.RemoteIpAddress?.ToString().Replace("\n", "").Replace("\r", "") ?? "Unknown";

        logger.LogInformation("➡️ HTTP {Method} {Path} from {IP}",
            sanitizedMethod, sanitizedPath, sanitizedIP);

        await next(context);

        sw.Stop();

        var response = context.Response;

        logger.LogInformation("✅ HTTP {StatusCode} for {Method} {Path} in {Elapsed}ms",
            response.StatusCode, sanitizedMethod, sanitizedPath, sw.ElapsedMilliseconds);
    }
}