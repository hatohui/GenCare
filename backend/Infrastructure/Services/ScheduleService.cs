﻿using Application.DTOs.Schedule.Model;
using Application.DTOs.Schedule.Request;
using Application.DTOs.Schedule.Response;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Common.Constants;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;

public class ScheduleService(IScheduleRepository scheduleRepository,
                             IAccountRepository accountRepository,
                             ISlotRepository slotRepository) : IScheduleService
{
    public async Task AddScheduleAsync(ScheduleCreateRequest request)
    {
        await scheduleRepository.Add(new Schedule()
        {
            SlotId = Guid.Parse(request.SlotId),
            AccountId = Guid.Parse(request.AccountId)
        });
    }

    public async Task DeleteScheduleAsync(string scheduleId)
    {
        Schedule? s = scheduleRepository.GetById(Guid.Parse(scheduleId)).Result;
        if (s == null)
        {
            throw new AppException(400, "Schedule not found");
        }
        await scheduleRepository.Delete(s);
    }

    public async Task<List<AllScheduleViewResponse>> GetAllScheduleAsync(DateTime? startAt, DateTime? endAt)
    {
        //get all slot
        var slots = await slotRepository.GetAll();
        slots = slots.OrderBy(s => s.No).ToList();
        if (startAt != null && endAt != null)
        {
            slots = slots.Where(s => s.StartAt >= startAt && s.EndAt <= endAt).ToList();
        }
        //get schedule list of all slots
        //get account of each schedule

        List<AllScheduleViewResponse> rs = new();
        foreach (var slot in slots)
        {//duyệt qua từng slot
            List<AccountResponseModel> accounts = new();
            foreach (var schedule in slot.Schedules)//duyệt qua từng sche của từng slot
                                                    //để lấy từng account tương ứng
            {
                var account = await accountRepository.GetAccountByIdAsync(schedule.AccountId);//lay acc
                if (account != null)
                {
                    //sau khi lấy được acc thì chúng ta chuyển nó sang model rồi add
                    //nó vào account list -> cần account list để bỏ vào trong response
                    accounts.Add(new AccountResponseModel()
                    {
                        Id = account.Id.ToString("D"),
                        Email = account.Email,
                        PhoneNumber = account.Phone,
                        FirstName = account.FirstName,
                        LastName = account.LastName
                    });
                }
            }
            //sau khi đã lấy được account list của từng slot thì chúng ta se add nao va slot
            rs.Add(new AllScheduleViewResponse()
            {
                Acccounts = accounts,
                No = slot.No,
                StartAt = slot.StartAt,
                EndAt = slot.EndAt
            });
        }
        //rs
        return rs;
    }

    public async Task<ScheduleViewResponse> GetScheduleAsync(string accessToken, string id, DateTime? startAt, DateTime? endAt)
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
            if (roleToken.ToLower() == RoleNames.Staff.ToLower() ||
                roleToken.ToLower() == RoleNames.Consultant.ToLower())
            {
                if (idToken.ToString("D") == id) check = true;
            }
            //if manager --> view schedule of staff and consultant
            if (roleToken.ToLower() == RoleNames.Manager.ToLower())
            {
                if (account.Role.Name.ToLower() == RoleNames.Staff ||
                    account.Role.Name.ToLower() == RoleNames.Consultant)
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
                var s = slotRepository.GetById(schedule.SlotId);
                //check time of slot
                if (startAt != null && endAt != null)
                {
                    if (s.Result!.StartAt >= startAt && s.Result!.EndAt <= endAt)
                    {
                        rs.Slots.Add(new SlotResponseModel()
                        {
                            No = s.Result == null ? default : s.Result.No,
                            EndAt = s.Result == null ? default : s.Result.EndAt,
                            StartAt = s.Result == null ? default : s.Result.StartAt
                        });
                    }
                }
                else
                {
                    rs.Slots.Add(new SlotResponseModel()
                    {
                        No = s.Result == null ? default : s.Result.No,
                        EndAt = s.Result == null ? default : s.Result.EndAt,
                        StartAt = s.Result == null ? default : s.Result.StartAt
                    });
                }
            }
            return rs;
        }
    }

    public async Task UpdateScheduleAsync(ScheduleUpdateRequest request)
    {
        Schedule? s = scheduleRepository.GetById(Guid.Parse(request.ScheduleId)).Result;
        if (s == null)
        {
            throw new AppException(400, "Schedule not found");
        }
        s.SlotId = request.SlotId != null ? Guid.Parse(request.SlotId) : s.SlotId;
        s.AccountId = request.AccountId != null ? Guid.Parse(request.AccountId) : s.AccountId;
        await scheduleRepository.Update(s);
    }
}