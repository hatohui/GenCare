using Application.DTOs.Slot.Request;
using Application.DTOs.Slot.Response;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;

public class SlotService(ISlotRepository slotRepository) : ISlotService
{
    public async Task<CreateSlotResponse> CreateSlot(CreateSlotRequest request)
    {
        //check no if it is greater than zero
        if(request.No <= 0)
            throw new AppException(402, "Slot number must be greater than zero.");
        //check start time and end time
        if(request.StartTime >= request.EndTime)
            throw new AppException(403, "Start time must be before end time.");
        if(request.StartTime <= DateTime.Now)
            throw new AppException(404, "Start time must be now or future time.");
        bool isExistTime = await slotRepository.CheckTimeExist(request.StartTime, request.EndTime);
        if(isExistTime)
            throw new AppException(405, "Slot time already exists.");
        var slot = new Slot()
        {
            No = request.No,
            StartAt = request.StartTime,
            EndAt = request.EndTime,
            IsDeleted = request.IsDeleted
        };
        await slotRepository.Add(slot);
        return new CreateSlotResponse()
        {
            Success = true,
            Message = "Slot created successfully."
        };
    }
}