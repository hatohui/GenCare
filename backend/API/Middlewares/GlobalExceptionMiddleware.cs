using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text.Json;

namespace Web.Middlewares;

public class GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context).ConfigureAwait(false);
        }
        catch (ValidationException vex)
        {
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            context.Response.ContentType = "application/json";

            var validationErrors = new[]
            {
                new { field = "Unknown", message = vex.Message }
            };

            var problemDetails = new
            {
                type = "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                title = "One or more validation errors occurred.",
                status = 400,
                errors = validationErrors
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails), context.RequestAborted).ConfigureAwait(false);
        }
        catch (UnauthorizedAccessException)
        {
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync(JsonSerializer.Serialize(new
            {
                error = "Unauthorized access"
            }), context.RequestAborted).ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception");

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            var problem = new
            {
                type = "https://tools.ietf.org/html/rfc9110#section-15.6.1",
                title = "Internal Server Error",
                status = 500,
                detail = ex.Message
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(problem), context.RequestAborted).ConfigureAwait(false);
        }
    }
}