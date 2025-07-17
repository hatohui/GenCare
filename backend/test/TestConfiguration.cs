using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Test;

public static class TestConfiguration
{
    public static IServiceCollection ConfigureTestServices(this IServiceCollection services)
    {
        // Configure test-specific services here
        services.AddLogging(builder =>
        {
            builder.AddConsole();
            builder.SetMinimumLevel(LogLevel.Debug);
        });

        return services;
    }
} 