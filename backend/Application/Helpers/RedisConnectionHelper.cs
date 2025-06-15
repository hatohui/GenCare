namespace Application.Helpers;

public static class RedisConnectionHelper
{
    public static string FromUri(string redisUri)
    {
        if (string.IsNullOrWhiteSpace(redisUri))
            throw new ArgumentNullException(nameof(redisUri));

        var uri = new Uri(redisUri);

        if (uri.Scheme != "redis" && uri.Scheme != "rediss")
            throw new ArgumentException("Invalid Redis URI scheme. Use redis:// or rediss://");

        var host = uri.Host;
        var port = uri.Port;
        var userInfo = uri.UserInfo.Split(':');
        var password = userInfo.Length > 1 ? userInfo[1] : string.Empty;
        var ssl = uri.Scheme == "rediss" ? "True" : "False";

        return $"{host}:{port},password={password},ssl={ssl},abortConnect=False";
    }
}