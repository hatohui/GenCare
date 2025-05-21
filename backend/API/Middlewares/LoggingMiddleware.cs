using System.Diagnostics;

namespace API.Middlewares;

public class LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();

        var request = context.Request;
        logger.LogInformation("➡️ HTTP {Method} {Path} from {IP}",
            request.Method, request.Path, context.Connection.RemoteIpAddress);

        await next(context);

        sw.Stop();
        var response = context.Response;
        logger.LogInformation("✅ HTTP {StatusCode} for {Method} {Path} in {Elapsed}ms",
            response.StatusCode, request.Method, request.Path, sw.ElapsedMilliseconds);
    }
}