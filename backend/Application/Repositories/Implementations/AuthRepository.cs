using Application.Repositories.Interfaces;
using Domain.Entities;

namespace Application.Repositories.Implementations;

public class AuthRepository : IAuthRepository
{
    Task<Guid> IAuthRepository.AddUserAsync(User user)
    {
        throw new NotImplementedException();
    }

    Task<User?> IAuthRepository.GetByEmailAsync(string email)
    {
        throw new NotImplementedException();
    }

    Task<User?> IAuthRepository.GetByPhoneNumberAsync(string phoneNumber)
    {
        throw new NotImplementedException();
    }

    Task<User?> IAuthRepository.GetByRefreshTokenAsync(string refreshToken)
    {
        throw new NotImplementedException();
    }

    Task IAuthRepository.UpdateRefreshTokenAsync(int userId, string refreshToken)
    {
        throw new NotImplementedException();
    }

    Task IAuthRepository.UpdateUserAsync(User user)
    {
        throw new NotImplementedException();
    }
}