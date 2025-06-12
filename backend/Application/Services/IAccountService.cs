using Application.DTOs.Account;
using Application.DTOs.Account.Requests;
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

    Task<StaffAccountCreateResponse> CreateStaffAccountAsync(StaffAccountCreateRequest request, string accessToken);

    Task<GetAccountByPageResponse> GetAccountsByPageAsync(GetAccountByPageRequest request);

    Task<Account> GetAccountByIdAsync(Guid accountId);

    Task<DeleteAccountResponse> DeleteAccountAsync(DeleteAccountRequest request, string accessToken);

    Task UpdateAccountAsync(UpdateAccountRequest request, string accessToken, string accountId);
    Task<ProfileViewModel> GetProfileAsync(Guid accountId);
}