namespace API.Middlewares;

public class RateLimitMiddleware(RequestDelegate next)
{
    private int _requestCounter = 0;
    private DateTime _startTime = DateTime.UtcNow;
    private const int _maxRequestsPerSecond = 10;

    public async Task Invoke(HttpContext context)
    {
        var currentTime = DateTime.UtcNow;
        var elapsedSeconds = (currentTime - _startTime).TotalSeconds;

        // Nếu đã qua 1 giây, reset lại bộ đếm
        if (elapsedSeconds >= 1)
        {
            _requestCounter = 0;
            _startTime = currentTime;
        }

        _requestCounter++;

        if (_requestCounter > _maxRequestsPerSecond)
        {
            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            await context.Response.WriteAsync("Too many requests. Please wait and try again.");
            return;
        }

        await next(context);
    }
}