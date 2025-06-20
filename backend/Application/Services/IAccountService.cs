using Application.DTOs.Account;
using Application.DTOs.Account.Requests;
using Application.DTOs.Account.Responses;
using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Google.Apis.Auth;

namespace Application.Services;

/// <summary>
/// Provides account-related service operations such as registration, authentication, profile management, and staff account management.
/// </summary>
public interface IAccountService
{
    /// <summary>
    /// Registers a new user account.
    /// </summary>
    /// <param name="request">The registration request containing user information.</param>
    /// <returns>The registration response with tokens and expiration.</returns>
    Task<AccountRegisterResponse> RegisterAsync(AccountRegisterRequest request);

    Task<(string AccessToken, string RefreshToken)> LoginAsync(AccountLoginRequest request);

    /// <summary>
    /// Initiates the forgot password process and sends a reset link to the user's email.
    /// </summary>
    /// <param name="request">The forgot password request containing the user's email.</param>
    /// <returns>The response containing the callback URL for password reset.</returns>
    Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request);

    /// <summary>
    /// Resets the user's password using a valid reset token.
    /// </summary>
    /// <param name="request">The reset password request containing the token and new password.</param>
    /// <returns>The response indicating the result of the reset operation.</returns>
    Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request);

    Task<bool> RevokeRefreshTokenAsync(string refreshToken);

    Task<(string AccessToken, string RefreshToken)> RefreshAccessTokenAsync(string oldRefreshToken);

    Task<(string AccessToken, string RefreshToken)> LoginWithGoogleAsync(GoogleJsonWebSignature.Payload payload);

    /// <summary>
    /// Creates a new staff account.
    /// </summary>
    /// <param name="request">The staff account creation request.</param>
    /// <param name="accessToken">The access token of the user performing the operation.</param>
    /// <returns>The response containing the created staff account information.</returns>
    Task<StaffAccountCreateResponse> CreateStaffAccountAsync(StaffAccountCreateRequest request, string accessToken);

    Task<GetAccountByPageResponse> GetAccountsByPageAsync(GetAccountByPageRequest request);

    Task<AccountViewModel?> GetAccountByIdAsync(Guid accountId);

    Task<DeleteAccountResponse> DeleteAccountAsync(DeleteAccountRequest request, string accessToken);

    /// <summary>
    /// Updates an existing user account.
    /// </summary>
    /// <param name="request">The update account request containing updated information.</param>
    /// <param name="accessToken">The access token of the user performing the operation.</param>
    /// <param name="accountId">The unique identifier of the account to update.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task UpdateAccountAsync(UpdateAccountRequest request, string accessToken, string accountId);

    Task<ProfileViewModel> GetProfileAsync(Guid accountId);
}