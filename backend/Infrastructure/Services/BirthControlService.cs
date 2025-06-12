using Application.DTOs.BirthControl.Response;
using Application.Repositories;
using Application.Services;

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
}