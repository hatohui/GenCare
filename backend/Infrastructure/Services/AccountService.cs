using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Infrastructure.Repositories;

namespace Infrastructure.Services;

public class AccountService(IAccountRepository accountRepo, IRoleRepository roleRepo, IRefreshTokenRepository refTokenRepo) : IAccountService
{
 
    public async Task<UserRegisterResponse> RegisterAsync(UserRegisterRequest request)
    {
        // Validate the request
        var existtingUser = accountRepo.GetByEmailAsync(request.Email);
        if (existtingUser.Result is not null)
        {
            throw new Exception("User already exists");
        }
        if (request.Password != request.ConfirmedPassword)
        {
            throw new Exception("Passwords do not match");
        }
        //create the user and hash password
        var user = new Account()
        {
            RoleId = roleRepo.GetRoleByNameAsync("Member").Result!.Id,
            Gender = false,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PasswordHash = PasswordHasher.Hash(request.Password),
            DateOfBirth = request.DateOfBirth,

        };
        // Save the user to the database
        await accountRepo.AddAsync(user);
        //create refresh token for user
        var (refToken, refExpiration) = JwtHelper.GenerateRefreshToken(user.Id);
        RefreshToken rf = new()
        {
            AccountId = user.Id,
            Token = refToken,
            ExpiresAt = refExpiration
        };
        //add refresh token to database
        await refTokenRepo.AddAsync(rf);
        //create access token
        var (accToken, accExpiration) = JwtHelper.GenerateAccessToken(user.Id, user.Email, user.Role.Name);
        // Return the response
        return new UserRegisterResponse
        {
            RefreshToken = rf.Token,
            AccessToken = accToken,
            AccessTokenExpiration = accExpiration
        };
    }

    public async Task<UserLoginResponse?> LoginAsync(UserLoginRequest request)
    {
        var user = await accountRepo.GetAccountByEmailPasswordAsync(request.Email, request.Password);
        if (user is null)
        {
            throw new Exception("Invalid email or password");
        }
        //create access and refresh tokens
        var (accessToken, accessTokenExpiration) =
            JwtHelper.GenerateAccessToken(user.Id, user.Email, user.Role.Name);
        var (refreshToken, refreshTokenExpiration) =
            JwtHelper.GenerateRefreshToken(user.Id);
        //add refresh token to database
        
        RefreshToken rf = new()
        {
            AccountId = user.Id,
            Token = refreshToken,
            ExpiresAt = refreshTokenExpiration
        };
        await refTokenRepo.AddAsync(rf);

        return new UserLoginResponse()
        {
            AccessToken = accessToken,
            AccessTokenExpiration = accessTokenExpiration,
            RefreshToken = refreshToken 
        };
    }
}
