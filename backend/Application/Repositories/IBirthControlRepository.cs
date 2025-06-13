using Domain.Entities;

namespace Application.Repositories;

public interface IBirthControlRepository
{
    Task<bool> AddBirthControlAsync(BirthControl birthControl);
    Task<bool> RemoveBirthControlAsync(Guid accountId);
    Task<bool> UpdateBirthControlAsync(Guid accountId);
    Task<BirthControl> GetBirthControlAsync(Guid accountId);
    Task<bool> CheckBirthControlExistsAsync(Guid accountId);
}