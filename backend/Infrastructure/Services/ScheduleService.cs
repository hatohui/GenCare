using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Schedule.Request;
using Application.Repositories;
using Application.Services;
using Domain.Entities;

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
}
