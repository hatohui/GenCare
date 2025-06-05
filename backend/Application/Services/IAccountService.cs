using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;

namespace Application.Services;

public interface IAccountService
{
    Task<AccountRegisterResponse> RegisterAsync(AccountRegisterRequest request);

    Task<(string AccessToken, string RefreshToken)> LoginAsync(AccountLoginRequest request);

    Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request);

    Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request);
    Task<bool> RevokeRefreshTokenAsync(string refreshToken);
}