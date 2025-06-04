using System.Net;
using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Newtonsoft.Json.Linq;

namespace Infrastructure.Services;

public class AccountService(
    IAccountRepository accountRepo,
    IRefreshTokenRepository refTokenRepo,
    IRoleRepository roleRepo,
    IEmailService emailService
) : IAccountService
{
    public async Task<AccountRegisterResponse> RegisterAsync(AccountRegisterRequest request)
    {
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
            Role = role,
        };
        //add user to database
        await accountRepo.AddAsync(user);

        //create refresh token
        var (refToken, refExpiration) = JwtHelper.GenerateRefreshToken(user.Id);

        var rf = new RefreshToken
        {
            AccountId = user.Id,
            Token = refToken,
            ExpiresAt = refExpiration,
        };
        //add refresh token to database
        await refTokenRepo.AddAsync(rf);

        var (accToken, accExpiration) = JwtHelper.GenerateAccessToken(user);

        return new AccountRegisterResponse
        {
            RefreshToken = rf.Token,
            AccessToken = accToken,
            AccessTokenExpiration = accExpiration,
        };
    }

    public async Task<AccountLoginResponse?> LoginAsync(AccountLoginRequest request)
    {
        var user =
            await accountRepo.GetAccountByEmailPasswordAsync(request.Email, request.Password)
            ?? throw new Exception("Invalid email or password");
        //create access and refresh tokens
        var (accessToken, accessTokenExpiration) = JwtHelper.GenerateAccessToken(user);
        var (refreshToken, refreshTokenExpiration) = JwtHelper.GenerateRefreshToken(user.Id);
        //add refresh token to database

        RefreshToken rf = new()
        {
            AccountId = user.Id,
            Token = refreshToken,
            ExpiresAt = refreshTokenExpiration,
        };
        await refTokenRepo.AddAsync(rf);

        return new()
        {
            AccessToken = accessToken,
            AccessTokenExpiration = accessTokenExpiration,
            RefreshToken = refreshToken,
        };
    }

    public async Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        //find user by email
        var user = await accountRepo.GetByEmailAsync(request.Email);
        if (user is null)
            throw new Exception("User not found");

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
        return new ForgotPasswordResponse()
        {
            CallbackUrl = callbackUrl,
        };
    }

    public async Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request)
    {
        Guid userId;
        //check if token is valid
        var isValid = JwtHelper.ValidatePasswordResetToken(request.ResetPasswordToken!, out userId);
        if (!isValid)
            throw new Exception("Invalid reset password token");
        //get user by email
        var user = accountRepo.GetByEmailAsync(request.Email!) ?? throw new Exception("email in reset passsword token is invalid");
        //check userId of token and email in request
        if (!Guid.Equals(userId, user.Result!.Id))
            throw new Exception("User ID in reset password token does not match email");
        //update user password
        user.Result!.PasswordHash = PasswordHasher.Hash(request.NewPassword!);
        await accountRepo.UpdateAccount(user.Result);
        return new ResetPasswordResponse()
        {
            msg = "Password reset successfully. You can now login with your new password.",
        };
    }

}
