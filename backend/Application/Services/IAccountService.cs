using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;


namespace Application.Services;

public interface IAccountService
{
    Task<UserLoginResponse?> LoginAsync(UserLoginRequest request);
}