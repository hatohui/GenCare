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

/// <summary>
/// Provides schedule-related service operations.
/// </summary>
public interface IScheduleService
{
    /// <summary>
    /// Adds a new schedule.
    /// </summary>
    /// <param name="request">The schedule creation request.</param>
    /// <returns>A task representing the asynchronous add operation.</returns>
    Task AddScheduleAsync(ScheduleCreateRequest request);

    /// <summary>
    /// Updates an existing schedule.
    /// </summary>
    /// <param name="request">The schedule update request.</param>
    /// <returns>A task representing the asynchronous update operation.</returns>
    Task UpdateScheduleAsync(ScheduleUpdateRequest request);

    /// <summary>
    /// Deletes a schedule by its identifier.
    /// </summary>
    /// <param name="scheduleId">The unique identifier of the schedule to delete.</param>
    /// <returns>A task representing the asynchronous delete operation.</returns>
    Task DeleteScheduleAsync(string scheduleId);

    /// <summary>
    /// Retrieves a schedule by access token, account ID, and optional date range.
    /// </summary>
    /// <param name="accessToken">The access token of the user.</param>
    /// <param name="id">The account or schedule identifier.</param>
    /// <param name="startAt">The optional start date filter.</param>
    /// <param name="endAt">The optional end date filter.</param>
    /// <returns>The schedule view response.</returns>
    Task<ScheduleViewResponse> GetScheduleAsync(string accessToken, string id, DateTime? startAt, DateTime? endAt);

    /// <summary>
    /// Retrieves all schedules within an optional date range.
    /// </summary>
    /// <param name="startAt">The optional start date filter.</param>
    /// <param name="endAt">The optional end date filter.</param>
    /// <returns>A list of all schedule view responses.</returns>
    Task<List<AllScheduleViewResponse>> GetAllScheduleAsync(DateTime? startAt, DateTime? endAt);
}
