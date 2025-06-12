using Domain.Entities;

namespace Application.Repositories;

public interface IStaffInfoRepository
{
    Task AddStaffInfoAsync(StaffInfo staffInfo);

    Task<StaffInfo?> GetStaffInfoByAccountIdAsync(Guid accountId);
}