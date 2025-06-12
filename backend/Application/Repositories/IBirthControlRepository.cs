using Domain.Entities;

namespace Application.Repositories;

public interface IBirthControlRepository
{
    Task<bool> AddBirthControlAsync(Guid accountId);
    Task<bool> RemoveBirthControlAsync(Guid accountId);
    Task<bool> UpdateBirthControlAsync(Guid accountId);
    Task<BirthControl> GetBirthControlAsync(Guid accountId);
}