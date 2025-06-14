using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Schedule.Request;
using Application.DTOs.Schedule.Response;
using Application.Helpers;
using Domain.Common.Constants;
using Domain.Entities;

namespace Application.Services;
public interface IScheduleService
{
    Task AddScheduleAsync(ScheduleCreateRequest request);

    Task UpdateScheduleAsync(ScheduleUpdateRequest request);

    Task DeleteScheduleAsync(string scheduleId);

    Task<ScheduleViewResponse> GetScheduleAsync(string accessToken, string id, DateTime? startAt, DateTime? endAt);
}
