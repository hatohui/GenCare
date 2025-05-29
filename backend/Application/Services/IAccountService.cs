using Application.DTOs.Auth.Responses;
using Application.DTOs.Auth.Requests;   

namespace Application.Services;

public interface IAccountService
{
    Task<UserRegisterResponse> RegisterAsync(UserRegisterRequest request);
}