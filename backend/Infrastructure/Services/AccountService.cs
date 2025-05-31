using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Entities;

namespace Infrastructure.Services;

public class AccountService(
    IAccountRepository accountRepo,
    IRefreshTokenRepository refTokenRepo,
    IRoleRepository roleRepo
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
}
