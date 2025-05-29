using Application.Repositories;
using Application.Services;

namespace Infrastructure.Services;

public class AuthService(IAuthRepository authRepo) : IAuthService
{
}