using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Entities;

namespace Infrastructure.Services;

public class AccountService(IAccountRepository accountRepo) : IAccountService
{
    public async Task<UserLoginResponse?> LoginAsync(UserLoginRequest request)
    {
        var user = await accountRepo.GetAccountByEmailPasswordAsync(request.Email, request.Password);
        if (user is null)
        {
            throw new Exception("Invalid email or password");
        }

        var (accessToken, accessTokenExpiration) =
            JwtHelper.GenerateAccessToken(user.Id, user.Email, user.Role.ToString());
        var (refreshToken, refreshTokenExpiration) =
            JwtHelper.GenerateRefreshToken(user.Id);
        return new UserLoginResponse()
        {
            AccessToken = accessToken,
            AccessTokenExpiration = accessTokenExpiration,
            RefreshToken = refreshToken 
        };
    }
}