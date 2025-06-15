using System;

namespace Application.Helpers;

/// <summary>
/// Provides a helper to convert Redis URI to a StackExchange.Redis-compatible connection string.
/// </summary>
public static class RedisConnectionHelper
{
    /// <summary>
    /// Converts a Redis URI to a connection string compatible with StackExchange.Redis.
    /// Supports rediss:// and handles password, port fallback, and database index.
    /// </summary>
    /// <param name="redisUri">Redis URI from environment (e.g., rediss://user:pass@host:port/0)</param>
    /// <returns>Formatted connection string for Redis client</returns>
    public static string FromUri(string redisUri)
    {
        if (string.IsNullOrWhiteSpace(redisUri))
            throw new ArgumentNullException(nameof(redisUri));

        // Remove surrounding quotes and whitespace (Linux .env compatibility)
        redisUri = redisUri.Trim().Trim('"');

        var uri = new Uri(redisUri);

        if (uri.Scheme != "redis" && uri.Scheme != "rediss")
            throw new ArgumentException("Invalid Redis URI scheme. Use redis:// or rediss://");

        var host = uri.Host;
        var port = uri.Port == -1 ? 6379 : uri.Port;

        var userInfo = uri.UserInfo.Split(':', 2);
        var password = userInfo.Length > 1
            ? Uri.UnescapeDataString(userInfo[1])
            : string.Empty;

        var ssl = uri.Scheme == "rediss" ? "True" : "False";

        var dbStr = uri.AbsolutePath.Trim('/');
        var db = string.IsNullOrEmpty(dbStr) ? "0" : dbStr;

        return $"{host}:{port},password={password},ssl={ssl},abortConnect=False,defaultDatabase={db}";
    }
}