using Application.DTOs.Slot;
using Application.DTOs.Slot.Model;
using Application.DTOs.Slot.Request;
using Application.DTOs.Slot.Response;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;

public class SlotService(ISlotRepository slotRepository) : ISlotService
{
    private static DateTime ToUnspecified(DateTime dt)
    {
        return DateTime.SpecifyKind(dt, DateTimeKind.Unspecified);
    }

    public async Task<CreateSlotResponse> CreateSlot(CreateSlotRequest request)
    {
        //check no if it is greater than zero
        if (request.No <= 0)
            throw new AppException(402, "Slot number must be greater than zero.");
        //check start time and end time
        if (request.StartTime >= request.EndTime)
            throw new AppException(403, "Start time must be before end time.");
        if (request.StartTime <= DateTime.Now)
            throw new AppException(404, "Start time must be now or future time.");
        //if in db has same time
        if (
            await slotRepository.CheckTimeExist(
                ToUnspecified(request.StartTime),
                ToUnspecified(request.EndTime)
            )
        )
            throw new AppException(405, "Slot time already exists.");
        var slot = new Slot()
        {
            No = request.No,
            StartAt = ToUnspecified(request.StartTime),
            EndAt = ToUnspecified(request.EndTime),
            IsDeleted = request.IsDeleted,
        };

        await slotRepository.Add(slot);

        return new CreateSlotResponse()
        {
            Success = true,
            Message = "Slot created successfully.",
            SlotId = slot.Id,
        };
    }

    public async Task<UpdateSlotResponse> UpdateSlot(UpdateSlotRequest request)
    {
        //check if slot id is valid
        var slot = await slotRepository.GetById(request.SlotId);
        if (slot == null)
            throw new AppException(404, "Slot not found.");

        // if user set No, StartTime, EndTime, use them, otherwise use current slot's values
        var newNo = request.No ?? slot.No;
        var newStartTime = request.StartTime ?? slot.StartAt;
        var newEndTime = request.EndTime ?? slot.EndAt;
        var newIsDeleted = request.IsDeleted ?? slot.IsDeleted;

        // Check slot number, if user input negative or zero
        if (newNo <= 0)
            throw new AppException(402, "Slot number must be greater than zero.");

        // Check times
        if (newStartTime >= newEndTime)
            throw new AppException(403, "Start time must be before end time.");
        if (newStartTime <= DateTime.Now)
            throw new AppException(404, "Start time must be now or future time.");

        //if user set not null for No, check if it exists in the database
        // Removed CheckNoExist validation to allow duplicate slot numbers

        // check db if the time slot exists preventing overlapping
        bool isExist = await slotRepository.CheckTimeExist(
            ToUnspecified(newStartTime),
            ToUnspecified(newEndTime),
            slot.Id
        );
        if (isExist)
            throw new AppException(405, "Slot time already exists.");

        // update slot
        slot.No = newNo;
        slot.StartAt = ToUnspecified(newStartTime);
        slot.EndAt = ToUnspecified(newEndTime);
        slot.IsDeleted = newIsDeleted;

        await slotRepository.Update(slot);

        return new UpdateSlotResponse { Success = true, Message = "Slot updated successfully." };
    }

    public async Task<DeleteSlotResponse> DeleteSlot(Guid id)
    {
        //check in db if slot exists
        var slot = await slotRepository.GetById(id);
        if (slot == null)
            throw new AppException(404, "Slot not found.");

        // if slot is already deleted, return success
        slot.IsDeleted = true;
        await slotRepository.Update(slot);

        return new DeleteSlotResponse
        {
            Success = true,
            Message = "Slot deleted successfully (soft delete).",
        };
    }

    public async Task<ViewAllSlotResponse> ViewAllSlot()
    {
        var slots = await slotRepository.ViewAllSlot(); // retrieves all slots with schedules and accounts

        var result = new ViewAllSlotResponse
        {
            Slots = slots
                .Select(slot => new ViewSlotForManager
                {
                    Id = slot.Id,
                    No = slot.No,
                    StartAt = slot.StartAt,
                    EndAt = slot.EndAt,
                    IsDeleted = slot.IsDeleted,
                    Accounts = slot
                        .Schedules.Where(sc => sc.Account != null && !sc.Account.IsDeleted)
                        .GroupBy(sc => sc.Account)
                        .Select(g => new AccountInforView
                        {
                            Id = g.Key.Id,
                            RoleId = g.Key.RoleId,
                            Email = g.Key.Email,
                            FirstName = g.Key.FirstName,
                            LastName = g.Key.LastName,
                            Phone = g.Key.Phone,
                            DateOfBirth = g.Key.DateOfBirth,
                            Gender = g.Key.Gender,
                            AvatarUrl = g.Key.AvatarUrl,
                            Schedules = g.Select(sc => new ScheduleStaff()
                                {
                                    Id = sc.Id,
                                    SlotId = sc.SlotId,
                                })
                                .ToList(),
                        })
                        .ToList(),
                })
                .ToList(),
        };

        return result;
    }
}
