using Application.Services;
using Google.Apis.Auth;

namespace Infrastructure.Services;

public class GoogleCredentialService : IGoogleCredentialService
{
    public async Task<GoogleJsonWebSignature.Payload> VerifyGoogleCredentialAsync(string clientId, string credential)
    {
        var settings = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = [clientId]
        };
        try
        {
            return await GoogleJsonWebSignature.ValidateAsync(credential, settings);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Invalid Google credential.", ex);
        }
    }
}