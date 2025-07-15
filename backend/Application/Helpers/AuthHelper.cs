using Microsoft.AspNetCore.Http;

namespace Application.Helpers;

public static class AuthHelper
{
    /// <summary>
    /// get access token from header Authorization in HttpContext.
    /// </summary>
    /// <param name="httpContext">HttpContext of request</param>
    /// <returns>Access token or empty string</returns>
    public static string GetAccessToken(HttpContext httpContext)
    {
        if (httpContext == null)
            return string.Empty;

        var authHeaders = httpContext.Request.Headers["Authorization"];

        foreach (var headerValue in authHeaders)
        {
            if (!string.IsNullOrWhiteSpace(headerValue) && headerValue.StartsWith("Bearer "))
            {
                var token = headerValue.Substring("Bearer ".Length).Trim();
                return token;
            }
        }
        return string.Empty;
    }
}