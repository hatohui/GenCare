using Application.DTOs.Auth.Request;
using Application.DTOs.Auth.Responses;

namespace Application.Services.Interfaces;

public interface IAuthService
{
    Task<Guid> RegisterAsync(UserRegisterRequest request);

    Task<UserLoginResponse> LoginAsync(UserLoginRequest request);

    Task<UserLoginResponse> RefreshTokenAsync(RefreshTokenRequest request);
}