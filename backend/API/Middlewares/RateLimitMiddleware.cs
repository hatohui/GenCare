namespace API.Middlewares;

public class RateLimitMiddleware(RequestDelegate next)
{
    private const int MaxRequests = 10;
    private static int _requestCounter;
    private static DateTime _startTime = DateTime.Now;
    private static readonly object _lock = new();

    public async Task InvokeAsync(HttpContext context)
    {
        lock (_lock)
        {
            var currentTime = DateTime.Now;
            var elapsedSeconds = (currentTime - _startTime).TotalSeconds;
            if (elapsedSeconds >= 1)
            {
                _requestCounter = 0;
                _startTime = currentTime;
            }

            _requestCounter++;
        }

        if (_requestCounter > MaxRequests)
        {
            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            await context.Response.WriteAsync("Too many requests. Please try again later.");
            return;
        }

        await next(context);
    }
}