using Application.DTOs.Auth.Request;
using Application.DTOs.Auth.Responses;
using Application.Helpers;
using Application.Repositories.Interfaces;
using Application.Services.Interfaces;
using Domain.Common.Enums;
using Domain.Entities;

namespace Application.Services.Implementations;

public class AuthService(IAuthRepository authRepo) : IAuthService
{
    // Đăng nhập với Google (hoặc OAuth2 provider khác)
    public async Task<UserLoginResponse> GoogleLoginAsync(string email, string name)
    {
        var user = await authRepo.GetByEmailAsync(email);

        if (user == null)
        {
            user = new User
            {
                Email = email,
                FullName = name,
                Role = UserRole.Member
            };
            await authRepo.AddUserAsync(user);
        }

        var accessToken = JwtHelper.GenerateAccessToken(user);

        return new UserLoginResponse
        {
            AccessToken = accessToken,
        };
    }

    public Task<UserLoginResponse> LoginAsync(UserLoginRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<UserLoginResponse> RefreshTokenAsync(RefreshTokenRequest request)
    {
        throw new NotImplementedException();
    }

    // Đăng ký người dùng mới
    public async Task<Guid> RegisterAsync(UserRegisterRequest request)
    {
        var existingUser = await authRepo.GetByEmailAsync(request.Email!);
        if (existingUser != null)
        {
            throw new Exception("Email already exists.");
        }

        var user = new User
        {
            FullName = request.FullName!,
            Email = request.Email!,
            Password = PasswordHasher.Hash(request.Password),
        };

        return await authRepo.AddUserAsync(user);
    }

    Task<Guid> IAuthService.RegisterAsync(UserRegisterRequest request)
    {
        throw new NotImplementedException();
    }
}