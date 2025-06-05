using Application.DTOs.Account.Responses;
using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Domain.Entities;
using Google.Apis.Auth;

namespace Application.Services;

public interface IAccountService
{
    Task<AccountRegisterResponse> RegisterAsync(AccountRegisterRequest request);

    Task<(string AccessToken, string RefreshToken)> LoginAsync(AccountLoginRequest request);

    Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request);

    Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request);
    Task<bool> RevokeRefreshTokenAsync(string refreshToken);

    Task<(string AccessToken, string RefreshToken)> RefreshAccessTokenAsync(string oldRefreshToken);

    Task<(string AccessToken, string RefreshToken)> LoginWithGoogleAsync(GoogleJsonWebSignature.Payload payload);

    Task<GetAccountByPageResponse> GetAccountsByPageAsync(int page, int count, string? search);
    Task<Account> GetAccountByIdAsync(Guid accountId);
}