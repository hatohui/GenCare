using System.Diagnostics;

namespace API.Middlewares;

public class LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
{
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

        // 🔐 Ghi log access token nếu có
        var authHeader = context.Request.Headers["Authorization"].ToString();
        if (!string.IsNullOrWhiteSpace(authHeader) && authHeader.StartsWith("Bearer "))
        {
            var accessToken = authHeader.Replace("Bearer ", "").Trim();
            logger.LogDebug("🔐 [{Time}] Access Token: {Token}", timestamp, accessToken);
        }

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