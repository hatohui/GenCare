using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;

namespace Application.Services;

public interface IAccountService
{
    Task<AccountRegisterResponse> RegisterAsync(AccountRegisterRequest request);

    Task<AccountLoginResponse?> LoginAsync(AccountLoginRequest request);

    Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request);

    Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request);
    Task<bool> RevokeRefreshTokenAsync(string refreshToken);
}