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
            var payload = await GoogleJsonWebSignature.ValidateAsync(credential, settings);
            return payload;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Invalid Google credential.", ex);
        }
    }
}