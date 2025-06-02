using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Api.Middlewares;

public class GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context).ConfigureAwait(false);
        }
        catch (AppException appEx) // Custom business logic exception
        {
            await WriteProblemDetailsAsync(context, appEx.StatusCode, "Application Error", appEx.Message);
        }
        catch (ValidationException vex) // System.ComponentModel.DataAnnotations
        {
            await WriteProblemDetailsAsync(context, 400, "Validation Failed", vex.Message);
        }
        catch (UnauthorizedAccessException)
        {
            await WriteProblemDetailsAsync(context, 401, "Unauthorized", "Access denied");
        }
        catch (KeyNotFoundException)
        {
            await WriteProblemDetailsAsync(context, 404, "Not Found", "Resource not found");
        }
        catch (DbUpdateException dbEx)
        {
            logger.LogError(dbEx, "Database update error");
            await WriteProblemDetailsAsync(context, 409, "Database Error", "Conflict occurred while updating the database");
        }
        catch (OperationCanceledException)
        {
            await WriteProblemDetailsAsync(context, 408, "Request Timeout", "The operation was cancelled or timed out");
        }
        catch (NotImplementedException)
        {
            await WriteProblemDetailsAsync(context, 501, "Not Implemented", "This feature is not yet available");
        }
        catch (BadHttpRequestException badReq)
        {
            await WriteProblemDetailsAsync(context, 400, "Bad Request", badReq.Message);
        }
        catch (HttpRequestException httpEx)
        {
            await WriteProblemDetailsAsync(context, 502, "External Request Failed", httpEx.Message);
        }
        catch (Exception ex) // Catch all fallbacks
        {
            logger.LogError(ex, "Unhandled exception");
            await WriteProblemDetailsAsync(context, 500, ex.Message, "An unexpected error occurred");
        }
    }

    private static async Task WriteProblemDetailsAsync(HttpContext context, int statusCode, string title, string detail)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/problem+json";

        var problemDetails = new
        {
            type = $"https://httpstatuses.com/{statusCode}",
            title,
            status = statusCode,
            detail
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails), context.RequestAborted).ConfigureAwait(false);
    }
}