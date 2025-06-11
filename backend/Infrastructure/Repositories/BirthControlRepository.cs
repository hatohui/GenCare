using Application.Repositories;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class BirthControlRepository: IBirthControlRepository
{
    public Task<bool> AddBirthControlAsync(Guid birthControlId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> RemoveBirthControlAsync(Guid birthControlId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateBirthControlAsync(Guid birthControlId)
    {
        throw new NotImplementedException();
    }

    public Task<BirthControl> GetBirthControlAsync(Guid birthControlId)
    {
        throw new NotImplementedException();
    }
}