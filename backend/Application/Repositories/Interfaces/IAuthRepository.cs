using Domain.Entities;

namespace Application.Repositories.Interfaces;

public interface IAuthRepository
{
    Task<User?> GetByPhoneNumberAsync(string phoneNumber);

    Task UpdateUserAsync(User user);

    Task<User?> GetByRefreshTokenAsync(string refreshToken);

    Task<User?> GetByEmailAsync(string email); // Lấy người dùng theo email

    Task<Guid> AddUserAsync(User user);         // Thêm người dùng mới

    Task UpdateRefreshTokenAsync(int userId, string refreshToken); // Cập nhật refresh token
}