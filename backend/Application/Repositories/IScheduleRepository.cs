using Domain.Entities;

namespace Application.Repositories;

/// <summary>
/// Provides data access methods for schedule entities.
/// </summary>
public interface IScheduleRepository
{
    /// <summary>
    /// Adds a new schedule to the data store.
    /// </summary>
    /// <param name="s">The schedule entity to add.</param>
    /// <returns>A task that represents the asynchronous add operation.</returns>
    Task Add(Schedule s);

    /// <summary>
    /// Retrieves all schedules.
    /// </summary>
    /// <returns>A list of all schedules.</returns>
    Task<List<Schedule>> GetAll();

    /// <summary>
    /// Updates an existing schedule in the data store.
    /// </summary>
    /// <param name="s">The schedule entity with updated information.</param>
    /// <returns>A task that represents the asynchronous update operation.</returns>
    Task Update(Schedule s);

    /// <summary>
    /// Deletes a schedule from the data store.
    /// </summary>
    /// <param name="s">The schedule entity to delete.</param>
    /// <returns>A task that represents the asynchronous delete operation.</returns>
    Task Delete(Schedule s);

    /// <summary>
    /// Retrieves a schedule by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the schedule.</param>
    /// <returns>The schedule if found; otherwise, null.</returns>
    Task<Schedule?> GetById(Guid id);
}