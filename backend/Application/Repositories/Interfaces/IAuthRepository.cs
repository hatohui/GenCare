using Domain.Entities;

namespace Application.Repositories.Interfaces;

public interface IAuthRepository
{
    Task<User?> GetByPhoneNumberAsync(string phoneNumber);

    Task<int> AddUserAsync(User user);

    Task UpdateUserAsync(User user);

    Task<User?> GetByRefreshTokenAsync(string refreshToken);
}