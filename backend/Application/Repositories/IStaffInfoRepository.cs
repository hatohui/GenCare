using Domain.Entities;

namespace Application.Repositories;

public interface IStaffInfoRepository
{
    /// <summary>
    /// Adds a new staff information record to the data store.
    /// </summary>
    /// <param name="staffInfo">The staff information entity to add.</param>
    /// <returns>A task that represents the asynchronous add operation.</returns>
    Task AddStaffInfoAsync(StaffInfo staffInfo);

    /// <summary>
    /// Retrieves staff information by the associated account's unique identifier.
    /// </summary>
    /// <param name="accountId">The unique identifier of the account.</param>
    /// <returns>The staff information if found; otherwise, null.</returns>
    Task<StaffInfo?> GetStaffInfoByAccountIdAsync(Guid accountId);
}