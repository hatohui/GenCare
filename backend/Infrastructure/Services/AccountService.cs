using System.Net;
using Application.DTOs.Account;
using Application.DTOs.Account.Responses;
using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Domain.Exceptions;
using Google.Apis.Auth;

namespace Infrastructure.Services;

public class AccountService
(
    IAccountRepository accountRepo,
    IRefreshTokenRepository refTokenRepo,
    IRoleRepository roleRepo,
    IEmailService emailService
) : IAccountService
{
    public async Task<AccountRegisterResponse> RegisterAsync(AccountRegisterRequest request)
    {
        //check if user already exists
        var existingUser = await accountRepo.GetByEmailAsync(request.Email);
        if (existingUser is not null)
        {
            throw new Exception("User already exists");
        }

        var role =
            await roleRepo.GetRoleByNameAsync("Member")
            ?? throw new Exception("Role 'Member' not found");

        //create new user account
        var user = new Account
        {
            Gender = request.Gender,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PasswordHash = PasswordHasher.Hash(request.Password),
            DateOfBirth = request.DateOfBirth,
            Phone = request.PhoneNumber,
            RoleId = role.Id,
            Role = role
        };
        //add user to database
        await accountRepo.AddAsync(user);

        //create refresh token
        var (refToken, refExpiration) = JwtHelper.GenerateRefreshToken();

        var rf = new RefreshToken
        {
            AccountId = user.Id,
            Token = refToken,
            ExpiresAt = refExpiration
        };
        //add refresh token to database
        await refTokenRepo.AddAsync(rf);

        var (accToken, accExpiration) = JwtHelper.GenerateAccessToken(user);

        return new AccountRegisterResponse
        {
            RefreshToken = rf.Token,
            AccessToken = accToken,
            AccessTokenExpiration = accExpiration
        };
    }


    public async Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        //find user by email
        var user = await accountRepo.GetByEmailAsync(request.Email);
        if (user is null)
        {
            throw new Exception("User not found");
        }

        //generate reset password token
        var resetPwdToken = JwtHelper.GeneratePasswordResetToken(user.Id);

        //create reset password URL
        var encodedToken = WebUtility.UrlEncode(resetPwdToken);
        var encodedEmail = WebUtility.UrlEncode(request.Email);
        var callbackUrl = $"{Environment.GetEnvironmentVariable("AppUrl")}/reset-password?email={encodedEmail}&token={encodedToken}";

        var msg = $"Link to reset your password: {callbackUrl}";
        //send email with reset password link
        await emailService.SendEmailAsync(
            request.Email,
            "Reset Password",
            msg
        );
        //return reponse
        return new ForgotPasswordResponse
        {
            CallbackUrl = callbackUrl
        };
    }

    public async Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request)
    {
        Guid userId;
        //check if token is valid
        var isValid = JwtHelper.ValidatePasswordResetToken(request.ResetPasswordToken!, out userId);
        if (!isValid)
        {
            throw new Exception("Invalid reset password token");
        }
        //get user by email
        var user = accountRepo.GetByEmailAsync(request.Email!) ?? throw new Exception("email in reset passsword token is invalid");
        //check userId of token and email in request
        if (!Equals(userId, user.Result!.Id))
        {
            throw new Exception("User ID in reset password token does not match email");
        }
        //update user password
        user.Result!.PasswordHash = PasswordHasher.Hash(request.NewPassword!);
        await accountRepo.UpdateAccount(user.Result);
        return new ResetPasswordResponse
        {
            msg = "Password reset successfully. You can now login with your new password."
        };
    }

    public async Task<bool> RevokeRefreshTokenAsync(string refreshToken)
    {
        var token = await refTokenRepo.GetByTokenAsync(refreshToken);
        if (token is null || token.IsRevoked)
        {
            return false;
        }

        token.IsRevoked = true;
        token.LastUsedAt = DateTime.Now;

        await refTokenRepo.UpdateAsync(token);
        return true;
    }

    public async Task<(string AccessToken, string RefreshToken)> LoginAsync(AccountLoginRequest req)
    {
        var user = await accountRepo
                       .GetAccountByEmailPasswordAsync(req.Email, req.Password)
                   ?? throw new InvalidCredentialsException();

        // Generate access token with only ID and Role
        var (accessToken, _) = JwtHelper.GenerateAccessToken(user);

        // Generate refresh token (a random string, not linked to account)
        var (refreshToken, _) = JwtHelper.GenerateRefreshToken();

        await refTokenRepo.AddAsync(new RefreshToken
        {
            AccountId = user.Id,
            Token = refreshToken,
            ExpiresAt = DateTime.Now.AddDays(7)
        });

        return (accessToken, refreshToken);
    }

    public async Task<(string AccessToken, string RefreshToken)> RefreshAccessTokenAsync(string oldRefresh)
    {
        // 1) Validate the refresh token (throws exception if invalid)
        var principal = JwtHelper.ValidateToken(oldRefresh); // if error -> JwtHelper throws it

        // 2) Ensure it's a refresh token
        if (!string.Equals(principal.FindFirst("type")?.Value, "refresh", StringComparison.Ordinal))
        {
            throw new AppException(401, "Token is not a refresh token");
        }

        // 3) Retrieve the token from the database
        var stored = await refTokenRepo.GetByTokenAsync(oldRefresh);
        if (stored is null || stored.IsRevoked || stored.ExpiresAt < DateTime.Now)
        {
            throw new AppException(401, "Refresh token expired or revoked");
        }

        // 4) Fetch the user from the database
        var user = await accountRepo.GetAccountByIdAsync(stored.AccountId)
                   ?? throw new AppException(404, "User not found");

        // 5) Generate new access and refresh tokens
        var (newAccess, _) = JwtHelper.GenerateAccessToken(user); // Access token with ID and Role
        var (newRefresh, newRefreshExp) = JwtHelper.GenerateRefreshToken(); // New random refresh token

        // 6) Revoke old refresh token & store new one
        stored.IsRevoked = true;
        await refTokenRepo.UpdateAsync(stored);

        await refTokenRepo.AddAsync(new RefreshToken
        {
            AccountId = user.Id,
            Token = newRefresh,
            ExpiresAt = newRefreshExp
        });

        return (newAccess, newRefresh);
    }

    public async Task<(string AccessToken, string RefreshToken)> LoginWithGoogleAsync(GoogleJsonWebSignature.Payload payload)
    {
        var user = await accountRepo.GetByEmailAsync(payload.Email);
        if (user == null)
        {
            var role = await roleRepo.GetRoleByNameAsync("Member")
                       ?? throw new Exception("Role 'Member' not found");

            user = new Account
            {
                Email = payload.Email,
                FirstName = payload.GivenName ?? string.Empty,
                LastName = payload.FamilyName ?? string.Empty,
                AvatarUrl = payload.Picture ?? string.Empty,
                PasswordHash = null,
                RoleId = role.Id,
                Role = role,
                Gender = true,
                IsDeleted = false
            };

            await accountRepo.AddAsync(user);
        }

        // Generate access token with only ID and Role
        var (accessToken, accessExpiration) = JwtHelper.GenerateAccessToken(user);

        // Generate refresh token (a random string, not linked to account)
        var (refreshToken, refreshExpiration) = JwtHelper.GenerateRefreshToken();

        RefreshToken rf = new()
        {
            AccountId = user.Id,
            Token = refreshToken,
            ExpiresAt = refreshExpiration
        };
        await refTokenRepo.AddAsync(rf);

        return (accessToken, refreshToken);
    }


    public async Task<GetAccountByPageResponse> GetAccountsByPageAsync(int page, int count, string? search)
    {
        var skip = page * count;

        // Gọi repo để thực hiện tìm kiếm
        var accounts = await accountRepo.GetAccountsByPageAsync(skip, count, search);

        var result = new GetAccountByPageResponse
        {
            Accounts = accounts.Select(a => new AccountViewModel
            {
                Id = a.Id,
                Role = a.Role?.Name ?? "Unknown",
                Email = a.Email,
                FirstName = a.FirstName ?? string.Empty,
                LastName = a.LastName ?? string.Empty,
                Gender = a.Gender,
                DateOfBirth = a.DateOfBirth,
                AvatarUrl = a.AvatarUrl,
                IsDeleted = a.IsDeleted
            }).ToList()
        };

        return result;
    }
    public async Task<Account> GetAccountByIdAsync(Guid accountId)
    {
        // Gọi repository để truy xuất tài khoản từ accountId
        return await accountRepo.GetAccountByIdAsync(accountId);
    }
}