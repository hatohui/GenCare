using Application.DTOs.BirthControl.Request;
using Application.DTOs.BirthControl.Response;
using Domain.Entities;

namespace Application.Services;

public interface IBirthControlService
{
    Task<ViewBirthControlResponse> ViewBirthControlAsync(Guid birthControlId);
    Task<CreateBirthControlResponse> AddBirthControlAsync(CreateBirthControlRequest request);
}