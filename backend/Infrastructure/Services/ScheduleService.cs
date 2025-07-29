using Application.DTOs.Schedule.Model;
using Application.DTOs.Schedule.Request;
using Application.DTOs.Schedule.Response;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Common.Constants;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;

public class ScheduleService(
    IScheduleRepository scheduleRepository,
    IAccountRepository accountRepository,
    ISlotRepository slotRepository
) : IScheduleService
{
    public async Task AddScheduleAsync(ScheduleCreateRequest request)
    {
        // Check if schedule already exists for this slot and account combination
        var existingSchedules = await scheduleRepository.GetAll();
        var duplicateSchedule = existingSchedules.FirstOrDefault(s =>
            s.SlotId == Guid.Parse(request.SlotId) && s.AccountId == Guid.Parse(request.AccountId)
        );

        if (duplicateSchedule != null)
        {
            throw new AppException(400, "Consultant is already assigned to this slot");
        }

        var newSchedule = new Schedule()
        {
            SlotId = Guid.Parse(request.SlotId),
            AccountId = Guid.Parse(request.AccountId),
        };

        await scheduleRepository.Add(newSchedule);
    }

    public async Task DeleteScheduleAsync(string scheduleId)
    {
        Schedule? s = await scheduleRepository.GetById(Guid.Parse(scheduleId));
        if (s == null)
        {
            throw new AppException(400, "Schedule not found");
        }
        await scheduleRepository.Delete(s);
    }

    public async Task<List<AllScheduleViewResponse>> GetAllScheduleAsync(
        DateTime? startAt,
        DateTime? endAt
    )
    {
        // Get all schedules with their related slot and account data
        var schedules = await scheduleRepository.GetAll();

        // Filter by date range if provided
        if (startAt != null && endAt != null)
        {
            schedules = schedules
                .Where(s => s.Slot.StartAt >= startAt && s.Slot.EndAt <= endAt)
                .ToList();
        }

        List<AllScheduleViewResponse> rs = new();

        foreach (var schedule in schedules)
        {
            var account = await accountRepository.GetAccountByIdAsync(schedule.AccountId);
            if (account != null)
            {
                rs.Add(
                    new AllScheduleViewResponse()
                    {
                        ScheduleId = schedule.Id,
                        Accounts = new List<AccountResponseModel>
                        {
                            new AccountResponseModel()
                            {
                                Id = account.Id.ToString("D"),
                                Email = account.Email,
                                PhoneNumber = account.Phone,
                                FirstName = account.FirstName,
                                LastName = account.LastName,
                                DateOfBirth = account.DateOfBirth?.ToString("yyyy-MM-dd"),
                                Gender = account.Gender,
                                AvatarUrl = account.AvatarUrl,
                            },
                        },
                        No = schedule.Slot.No,
                        StartAt = schedule.Slot.StartAt,
                        EndAt = schedule.Slot.EndAt,
                    }
                );
            }
        }

        return rs;
    }

    public async Task<ScheduleViewResponse> GetScheduleAsync(
        string accessToken,
        string id,
        DateTime? startAt,
        DateTime? endAt
    )
    {
        {
            //check authen
            //get account by id
            var account = await accountRepository.GetAccountByIdAsync(Guid.Parse(id));
            if (account == null)
                throw new AppException(401, "id is invalid");
            //get id by token
            Guid idToken = JwtHelper.GetAccountIdFromToken(accessToken);
            //get roleToken by token
            string roleToken = JwtHelper.GetRoleFromToken(accessToken);
            bool check = false;
            //if staff or consultant --> only view their own schedule
            if (
                roleToken.ToLower() == RoleNames.Staff.ToLower()
                || roleToken.ToLower() == RoleNames.Consultant.ToLower()
            )
            {
                if (idToken.ToString("D") == id)
                    check = true;
            }
            //if member --> can view consultant schedules for booking appointments
            if (roleToken.ToLower() == RoleNames.Member.ToLower())
            {
                if (account.Role.Name.ToLower() == RoleNames.Consultant.ToLower())
                    check = true;
            }
            //if manager --> view schedule of staff and consultant
            if (roleToken.ToLower() == RoleNames.Manager.ToLower())
            {
                if (
                    account.Role.Name.ToLower() == RoleNames.Staff
                    || account.Role.Name.ToLower() == RoleNames.Consultant
                )
                    check = true;
            }
            //if admin --> view schedule of all
            if (roleToken.ToLower() == RoleNames.Admin.ToLower())
                check = true;

            if (!check)
                throw new AppException(401, "account is invalid");

            //here, validate successfully
            var schedules = account.Schedules;
            //result
            ScheduleViewResponse rs = new();
            rs.Account = new AccountResponseModel();
            rs.Slots = new List<SlotResponseModel>();

            rs.Account.Id = account.Id.ToString("D");
            rs.Account.Email = account.Email;
            rs.Account.PhoneNumber = account.Phone;
            rs.Account.FirstName = account.FirstName;
            rs.Account.LastName = account.LastName;

            foreach (var schedule in schedules)
            {
                var slot = await slotRepository.GetById(schedule.SlotId);

                // Skip if slot not found
                if (slot == null)
                    continue;

                //check time of slot
                if (startAt != null && endAt != null)
                {
                    if (slot.StartAt >= startAt && slot.EndAt <= endAt)
                    {
                        rs.Slots.Add(
                            new SlotResponseModel()
                            {
                                No = slot.No,
                                EndAt = slot.EndAt,
                                StartAt = slot.StartAt,
                            }
                        );
                    }
                }
                else
                {
                    rs.Slots.Add(
                        new SlotResponseModel()
                        {
                            No = slot.No,
                            EndAt = slot.EndAt,
                            StartAt = slot.StartAt,
                        }
                    );
                }
            }
            return rs;
        }
    }

    public async Task UpdateScheduleAsync(ScheduleUpdateRequest request)
    {
        Schedule? s = await scheduleRepository.GetById(Guid.Parse(request.ScheduleId));
        if (s == null)
        {
            throw new AppException(400, "Schedule not found");
        }
        s.SlotId = request.SlotId != null ? Guid.Parse(request.SlotId) : s.SlotId;
        s.AccountId = request.AccountId != null ? Guid.Parse(request.AccountId) : s.AccountId;
        await scheduleRepository.Update(s);
    }
}
