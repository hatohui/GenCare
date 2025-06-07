using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;
public class StaffInfoRepository(IApplicationDbContext dbContext) : IStaffInfoRepository
{
    public async Task AddStaffInfoAsync(StaffInfo staffInfo)
    {
        await dbContext.StaffInfos.AddAsync(staffInfo);
        await dbContext.SaveChangesAsync();
    }
}
