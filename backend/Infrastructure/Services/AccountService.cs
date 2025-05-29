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
        var user = new Account
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

        //add refresh token to database
       
        // Return the response
        return new UserRegisterResponse
        {
            //chô nãy return refresh và access token
            //UserId = user.Id,
            //Message = "User registered successfully",
        };
    }

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
