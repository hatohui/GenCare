using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Google.Apis.Auth;

namespace Application.Services;

public interface IAccountService
{
    Task<AccountRegisterResponse> RegisterAsync(AccountRegisterRequest request);

    Task<AccountLoginResponse?> LoginAsync(AccountLoginRequest request);

    Task<bool> RevokeRefreshTokenAsync(string refreshToken);

    Task<AccountLoginResponse> LoginWithGoogleAsync(GoogleJsonWebSignature.Payload payload);
}