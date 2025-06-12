using Application.DTOs.BirthControl.Request;
using Application.DTOs.BirthControl.Response;
using Application.Repositories;
using Application.Services;
using Domain.Entities;

namespace Infrastructure.Services;

public class BirthControlService(IBirthControlRepository birthControlRepository) : IBirthControlService
{
    public async Task<ViewBirthControlResponse> ViewBirthControlAsync(Guid birthControlId)
    {
        var birthControl = await birthControlRepository.GetBirthControlAsync(birthControlId);
        

        return new ViewBirthControlResponse
        {
            StartDate = birthControl.StartDate,
            EndDate = birthControl.EndDate,
            StartSafeDate = birthControl.StartSafeDate,
            EndSafeDate = birthControl.EndSafeDate,
            StartUnsafeDate = birthControl.StartUnsafeDate,
            EndUnsafeDate = birthControl.EndUnsafeDate,
        };
    }

    public async Task<CreateBirthControlResponse> AddBirthControlAsync(CreateBirthControlRequest request)
    {
        var accountId  = await birthControlRepository.CheckBirthControlExistsAsync(request.AccountId);
        if (request.StartDate > request.EndDate)
        {
            throw new ArgumentException("Start date cannot be after end date.");
        }
        if(request.StartDate < DateTime.UtcNow)
        {
            throw new ArgumentException("Start date cannot be in the past.");
        }
        var startDate = request.StartDate.Date;
        var endDate = request.EndDate?.Date ?? startDate.AddDays(27); // Tổng 28 ngày

        var startUnsafeDate = startDate.AddDays(9);   // ngày 10
        var endUnsafeDate = startDate.AddDays(16);    // ngày 17

        var startSafeDate = startDate;                // ngày 1
        var endFirstSafeDate = startDate.AddDays(8);  // ngày 9

        var startSecondSafeDate = startDate.AddDays(17); // ngày 18
        var endSafeDate = endDate;                        // ngày 28

        var birthControl = new BirthControl
        {
            AccountId = request.AccountId,
            StartDate = startDate,
            EndDate = endDate,
            StartSafeDate = request.StartSafeDate,
            EndSafeDate = request.EndSafeDate,
            StartUnsafeDate = request.StartUnsafeDate,
            EndUnsafeDate = request.EndUnsafeDate
        };
        
    }
}