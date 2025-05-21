namespace API.Middlewares;

public class RateLimitMiddleware : IMiddleware
{
    private int requestCounter = 0;
    private DateTime startTime = DateTime.Now;
    private readonly int maxRequests = 10;

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var currentTime = DateTime.Now;
        var elapsedSeconds = (currentTime - startTime).TotalSeconds;
        if (elapsedSeconds >= 10000)
        {
            requestCounter = 0;
            startTime = currentTime;
        }

        requestCounter++;

        if (requestCounter > maxRequests)
        {
            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            await context.Response.WriteAsync("Too many requests. Please try again later.");
            return;
        }

        await next(context);
    }
}