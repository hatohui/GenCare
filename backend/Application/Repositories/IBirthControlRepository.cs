using Domain.Entities;

namespace Application.Repositories;

public interface IBirthControlRepository
{
    Task<bool> AddBirthControlAsync(Guid birthControlId);
    Task<bool> RemoveBirthControlAsync(Guid birthControlId);
    Task<bool> UpdateBirthControlAsync(Guid birthControlId);
    Task<BirthControl> GetBirthControlAsync(Guid birthControlId);
}