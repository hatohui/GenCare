using Application.Repositories.Implementations;
using Application.Repositories.Interfaces;
using Application.Services.Implementations;
using Application.Services.Interfaces;

namespace API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAuthRepository, AuthRepository>();
        // Thêm các service khác tại đây

        return services;
    }
}