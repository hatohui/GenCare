using Application.DTOs.BirthControl.Request;
using Application.DTOs.BirthControl.Response;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;

/// <summary>
/// Service for managing birth control cycles, including viewing, adding, updating, and removing.
/// The service calculates menstrual, unsafe, and safe periods based on the provided dates.
/// </summary>
public class BirthControlService(IBirthControlRepository birthControlRepository) : IBirthControlService

{
    //this method is used to convert DateTime to Unspecified kind
    private static DateTime ToUnspecified(DateTime dt)
    {
        return DateTime.SpecifyKind(dt, DateTimeKind.Unspecified);
    }

    /// <summary>
    /// Retrieves and calculates detailed information about a user's birth control cycle,
    /// including menstrual, unsafe, and safe periods.
    /// </summary>
    /// <param name="accountId">The unique identifier for the birth control cycle.</param>
    /// <returns>A response DTO containing the calculated periods.</returns>
    public async Task<ViewBirthControlResponse?> ViewBirthControlAsync(Guid accountId)
    {
        var birthControl = await birthControlRepository.GetBirthControlAsync(accountId);

        var menstrualStart = birthControl.StartDate;
        var menstrualEnd = birthControl.StartDate.AddDays(4);

        var firstSafeStart = birthControl.StartDate;
        var firstSafeEnd = birthControl.StartUnsafeDate.AddDays(-1);

        var secondSafeStart = birthControl.EndUnsafeDate.AddDays(1);
        var secondSafeEnd = birthControl.EndDate;
        return new ViewBirthControlResponse
        {
            StartDate = birthControl.StartDate,
            EndDate = birthControl.EndDate,

            MenstrualStartDate = menstrualStart,
            MenstrualEndDate = menstrualEnd,

            StartUnsafeDate = birthControl.StartUnsafeDate,
            EndUnsafeDate = birthControl.EndUnsafeDate,

            StartSafeDate = firstSafeStart,
            EndSafeDate = firstSafeEnd,

            SecondSafeStart = secondSafeStart,
            SecondSafeEnd = secondSafeEnd
        };
    }

    /// <summary>
    /// Adds a new birth control cycle for a user. Calculates all necessary periods and ensures data validity.
    /// </summary>
    /// <param name="request">The request DTO containing the required input data.</param>
    /// <returns>A response DTO indicating the operation result.</returns>
    /// <exception cref="ArgumentException">Thrown if input dates are invalid.</exception>

    public async Task<CreateBirthControlResponse?> AddBirthControlAsync(CreateBirthControlRequest request)
    {
        if (await birthControlRepository.CheckBirthControlExistsAsync(request.AccountId))
            throw new ArgumentException("Birth control already exists for this account.");
        if (request.StartDate > request.EndDate)
        {
            throw new ArgumentException("Start date cannot be after end date.");
        }
        if (request.StartDate < DateTime.Now)
        {
            throw new ArgumentException("Start date cannot be in the past.");
        }

        var startDate = ToUnspecified(request.StartDate.Date);
        var endDate = ToUnspecified(request.EndDate?.Date ?? request.StartDate.Date.AddDays(27)); // 1 cycle is 28 days

        var menstrualEnd = ToUnspecified(startDate.AddDays(4));// Menstrual period lasts 5 days

        var startUnsafeDate = ToUnspecified(startDate.AddDays(9));
        var endUnsafeDate = ToUnspecified(startDate.AddDays(16));// Unsafe period lasts 8 days

        var startSafeDate = ToUnspecified(menstrualEnd.AddDays(1));

        var endSafeDate = endDate;

        var birthControl = new BirthControl
        {
            AccountId = request.AccountId,

            StartDate = startDate,
            EndDate = endDate,

            StartSafeDate = startSafeDate,
            EndSafeDate = endSafeDate,

            StartUnsafeDate = startUnsafeDate,
            EndUnsafeDate = endUnsafeDate
        };

        await birthControlRepository.AddBirthControlAsync(birthControl);
        return new CreateBirthControlResponse
        {
            Success = true,
            Message = "Birth control added successfully.",
        };
    }

    /// <summary>
    /// Removes a birth control cycle by account ID.
    /// </summary>
    /// <param name="accountId">The account's unique identifier.</param>
    /// <returns>True if removal was successful, otherwise false.</returns>
    public async Task<bool> RemoveBirthControlAsync(Guid accountId) => await birthControlRepository.RemoveBirthControlAsync(accountId);

    /// Updates an existing birth control cycle, recalculating periods and validating input.
    /// <param name="request">The request DTO with updated information.</param>
    /// <returns>A response DTO indicating the operation result.</returns>
    /// <exception cref="AppException">Thrown if the cycle cannot be found or dates are invalid.</exception>
    public async Task<UpdateBirthControlResponse> UpdateBirthControlAsync(UpdateBirthControlRequest request)
    {
        var accountId = Guid.Empty;
        if (!Guid.TryParse(request.AccountId, out accountId))
            throw new AppException(400, "Invalid AccountId format.");
        var birthControl = await birthControlRepository.GetBirthControlAsync(accountId) ??
            throw new AppException(404, "Birth control not found.");

        if (request.StartDate >= request.EndDate)
        {
            throw new AppException(403, "Start date cannot be after end date.");
        }
        if (request.StartDate < DateTime.Now)
        {
            throw new AppException(403, "Start date cannot be in the past.");
        }
        var startDate = ToUnspecified(request.StartDate!.Value.Date);
        var endDate = ToUnspecified(request.EndDate?.Date ?? startDate.AddDays(27));

        birthControl.StartDate = startDate;
        birthControl.EndDate = endDate;
        birthControl.StartUnsafeDate = startDate.AddDays(9);
        birthControl.EndUnsafeDate = startDate.AddDays(16);
        birthControl.StartSafeDate = startDate;
        birthControl.EndSafeDate = endDate;

        await birthControlRepository.UpdateBirthControlAsync(birthControl);
        return new UpdateBirthControlResponse()
        {
            Success = true,
            Message = "Birth control updated successfully.",
        };
    }
}