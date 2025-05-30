using Google.Apis.Auth;

namespace Application.Services;

public interface IGoogleCredentialService
{
    Task<GoogleJsonWebSignature.Payload> VerifyGoogleCredentialAsync(string clientId, string credential);
}