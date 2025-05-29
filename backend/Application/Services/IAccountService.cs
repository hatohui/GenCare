using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;


namespace Application.Services;

public interface IAccountService
{
    Task<UserRegisterResponse> RegisterAsync(UserRegisterRequest request);
    Task<UserLoginResponse?> LoginAsync(UserLoginRequest request);
}