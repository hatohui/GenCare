using System.Diagnostics;

namespace API.Middlewares;

public class LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
{
    /// <summary>
    /// Processes an HTTP request, logging its start, completion, and any exceptions, along with timing and status information.
    /// </summary>
    /// <param name="context">The current HTTP context for the request.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();
        var timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff");

        var request = context.Request;
        var sanitizedMethod = request.Method.Replace("\n", "").Replace("\r", "");
        var sanitizedPath = request.Path.Value?.Replace("\n", "").Replace("\r", "") ?? string.Empty;
        var sanitizedIP = context.Connection.RemoteIpAddress?.ToString().Replace("\n", "").Replace("\r", "") ?? "Unknown";

        logger.LogInformation("➡️ [{Time}] HTTP {Method} {Path} from {IP}",
            timestamp, sanitizedMethod, sanitizedPath, sanitizedIP);

        try
        {
            await next(context); // tiếp tục đến middleware/handler kế tiếp
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "❌ [{Time}] Exception occurred while processing {Method} {Path} from {IP}",
                timestamp, sanitizedMethod, sanitizedPath, sanitizedIP);

            throw; // để middleware lỗi tổng vẫn xử lý được
        }
        finally
        {
            sw.Stop();
            var response = context.Response;

            logger.LogInformation("✅ [{Time}] HTTP {StatusCode} for {Method} {Path} in {Elapsed}ms",
                timestamp, response.StatusCode, sanitizedMethod, sanitizedPath, sw.ElapsedMilliseconds);
        }
    }
}