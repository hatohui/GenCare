using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Schedule.Request;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;
public class ScheduleService(IScheduleRepository scheduleRepository) : IScheduleService
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

    public async Task UpdateScheduleAsync(ScheduleUpdateRequest request)
    {
        Schedule? s = scheduleRepository.GetById(Guid.Parse(request.ScheduleId)).Result;
        if(s == null)
        {
            throw new AppException(400, "Schedule not found");
        }
        s.SlotId = request.SlotId != null ? Guid.Parse(request.SlotId) : s.SlotId;
        s.AccountId = request.AccountId != null ? Guid.Parse(request.AccountId) : s.AccountId;
        await scheduleRepository.Update(s);
    }
}
