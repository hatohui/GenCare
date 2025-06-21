using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Repositories;
/// <summary>
/// Defines methods for managing <see cref="Tag"/> entities in the data store.
/// </summary>
public interface ITagRepository
{
    /// <summary>
    /// Retrieves all <see cref="Tag"/> entities from the data store.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. The task result contains a list of tags.</returns>
    Task<List<Tag>> GetAll();

    /// <summary>
    /// Retrieves a <see cref="Tag"/> entity by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the tag.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the tag entity if found; otherwise, <c>null</c>.
    /// </returns>
    Task<Tag?> GetById(string id);

    /// <summary>
    /// Adds a new <see cref="Tag"/> to the data store.
    /// </summary>
    /// <param name="tag">The tag entity to add.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task Add(Tag tag);

    /// <summary>
    /// Updates an existing <see cref="Tag"/> entity in the data store.
    /// </summary>
    /// <param name="tag">The tag entity to update.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task Update(Tag tag);

    /// <summary>
    /// Deletes a <see cref="Tag"/> entity from the data store.
    /// </summary>
    /// <param name="tag">The tag entity to delete.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task Delete(Tag tag);

    Task<bool>CheckNameTagExists(string title);
    
    Task<Tag?>GetById(Guid id);
}