using Domain.Entities;

namespace Application.Repositories;

public interface IBirthControlRepository
{
    Task<bool> AddBirthControlAsync(BirthControl accountId);
    Task<bool> RemoveBirthControlAsync(Guid accountId);
    Task<bool> UpdateBirthControlAsync(BirthControl accountId);
    Task<BirthControl> GetBirthControlAsync(Guid accountId);
    Task<bool> CheckBirthControlExistsAsync(Guid accountId);
}