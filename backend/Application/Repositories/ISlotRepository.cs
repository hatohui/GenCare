using Domain.Entities;

namespace Application.Repositories;

/// <summary>
/// Provides data access methods for slot entities.
/// </summary>
public interface ISlotRepository
{
    /// <summary>
    /// Retrieves all slots.
    /// </summary>
    /// <returns>A list of all slots.</returns>
    Task<List<Slot>> GetAll();

    /// <summary>
    /// Adds a new slot to the data store.
    /// </summary>
    /// <param name="s">The slot entity to add.</param>
    /// <returns>A task that represents the asynchronous add operation.</returns>
    Task Add(Slot s);

    /// <summary>
    /// Deletes a slot from the data store.
    /// </summary>
    /// <param name="s">The slot entity to delete.</param>
    /// <returns>A task that represents the asynchronous delete operation.</returns>
    Task Delete(Slot s);

    /// <summary>
    /// Updates an existing slot in the data store.
    /// </summary>
    /// <param name="s">The slot entity with updated information.</param>
    /// <returns>A task that represents the asynchronous update operation.</returns>
    Task Update(Slot s);

    /// <summary>
    /// Retrieves a slot by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the slot.</param>
    /// <returns>The slot if found; otherwise, null.</returns>
    Task<Slot?> GetById(Guid id);
    
    Task<bool> Exist(Guid id);
    
    Task<bool> DeleteById(Guid id);
    Task<bool> CheckNoExist(int no);
    
    Task<bool> CheckTimeExist(DateTime startAt, DateTime endAt,Guid? excludeSlotId = null);
    
    Task<List<Slot>> ViewAllSlot();
}