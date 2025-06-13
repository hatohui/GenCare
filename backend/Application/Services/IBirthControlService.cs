using Application.DTOs.BirthControl.Request;
using Application.DTOs.BirthControl.Response;
using Domain.Entities;

namespace Application.Services;

/// <summary>
/// Provides methods for managing birth control data.
/// </summary>
public interface IBirthControlService
{
    /// <summary>
    /// Retrieves detailed information about a specific birth control record.
    /// </summary>
    /// <param name="birthControlId">The unique identifier of the birth control record.</param>
    /// <returns>A response containing the details of the birth control record.</returns>
    Task<ViewBirthControlResponse> ViewBirthControlAsync(Guid birthControlId);

    /// <summary>
    /// Adds a new birth control record to the system.
    /// </summary>
    /// <param name="request">The request containing the details of the birth control to be added.</param>
    /// <returns>A response indicating the success or failure of the operation.</returns>
    Task<CreateBirthControlResponse> AddBirthControlAsync(CreateBirthControlRequest request);

    /// <summary>
    /// Removes a birth control record associated with a specific account.
    /// </summary>
    /// <param name="accountId">The unique identifier of the account whose birth control record is to be removed.</param>
    /// <returns>A boolean indicating whether the removal was successful.</returns>
    Task<bool> RemoveBirthControlAsync(Guid accountId);
    
    Task<UpdateBirthControlResponse> UpdateBirthControlAsync(UpdateBirthControlRequest request);
}