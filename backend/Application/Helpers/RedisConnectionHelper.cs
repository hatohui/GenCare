namespace Application.Helpers;

public static class RedisConnectionHelper
{
    /// <summary>
    /// Parses a Redis URI and converts it to a StackExchange.Redis-compatible configuration string.
    /// Supports rediss scheme, password, and database index.
    /// </summary>
    /// <param name="redisUri">The Redis URI (e.g., rediss://user:password@host:port/1)</param>
    /// <returns>Formatted connection string for StackExchange.Redis</returns>
    public static string FromUri(string redisUri)
    {
        if (string.IsNullOrWhiteSpace(redisUri))
            throw new ArgumentNullException(nameof(redisUri));

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