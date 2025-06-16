using Domain.Entities;

namespace Application.Repositories;

/// <summary>
/// Defines methods for managing <see cref="Feedback"/> entities in the data store.
/// </summary>
public interface IFeedbackRepository
{
    /// <summary>
    /// Adds a new <see cref="Feedback"/> to the data store.
    /// </summary>
    /// <param name="feedback">The feedback entity to add.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task Add(Feedback feedback);

    /// <summary>
    /// Retrieves all <see cref="Feedback"/> entities from the data store.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. The task result contains a list of feedback entities.</returns>
    Task<List<Feedback>> GetAll();

    /// <summary>
    /// Retrieves a <see cref="Feedback"/> entity by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the feedback.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the feedback entity if found; otherwise, <c>null</c>.
    /// </returns>
    Task<Feedback?> GetById(string id);

    /// <summary>
    /// Updates an existing <see cref="Feedback"/> entity in the data store.
    /// </summary>
    /// <param name="feedback">The feedback entity to update.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task Update(Feedback feedback);

    /// <summary>
    /// Deletes a <see cref="Feedback"/> entity from the data store.
    /// </summary>
    /// <param name="feedback">The feedback entity to delete.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task Delete(Feedback feedback);
}