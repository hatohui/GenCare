namespace API.Extensions;

public static class AuthenticationExtensions
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection serviceDescriptors)
    {
        return serviceDescriptors;
    }
}