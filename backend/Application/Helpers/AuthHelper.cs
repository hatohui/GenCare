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

        var authHeader = httpContext.Request.Headers["Authorization"].ToString();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            return string.Empty;

        return authHeader.Replace("Bearer ", string.Empty).Trim();
    }
}
