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
            EndSafeDate= firstSafeEnd,

            SecondSafeStart = secondSafeStart,
            SecondSafeEnd = secondSafeEnd
        };
    }

    public async Task<CreateBirthControlResponse> AddBirthControlAsync(CreateBirthControlRequest request)
    {
        var accountId = await birthControlRepository.CheckBirthControlExistsAsync(request.AccountId);

        if (request.StartDate > request.EndDate)
        {
            throw new ArgumentException("Start date cannot be after end date.");
        }
        if (request.StartDate < DateTime.UtcNow)
        {
            throw new ArgumentException("Start date cannot be in the past.");
        }

        // Convert to Unspecified to avoid PostgreSQL timestamp type error
        DateTime ToUnspecified(DateTime dt) => DateTime.SpecifyKind(dt, DateTimeKind.Unspecified);

        var startDate = ToUnspecified(request.StartDate.Date);
        var endDate = ToUnspecified(request.EndDate?.Date ?? request.StartDate.Date.AddDays(27)); // 28 ngày

        var menstrualStart = startDate;
        var menstrualEnd = ToUnspecified(startDate.AddDays(4));

        var startUnsafeDate = ToUnspecified(startDate.AddDays(9));
        var endUnsafeDate = ToUnspecified(startDate.AddDays(16));

        var startSafeDate = ToUnspecified(menstrualEnd.AddDays(1));
        var endFirstSafeDate = ToUnspecified(startUnsafeDate.AddDays(-1));

        var startSecondSafeDate = ToUnspecified(endUnsafeDate.AddDays(1));
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

    public async Task<bool> RemoveBirthControlAsync(Guid accountId) => await birthControlRepository.RemoveBirthControlAsync(accountId);
    
    
    
}