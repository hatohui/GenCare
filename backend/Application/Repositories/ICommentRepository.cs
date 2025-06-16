using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Repositories;
/// <summary>
/// Defines methods for managing <see cref="Comment"/> entities in the data store.
/// </summary>
public interface ICommentRepository
{
    /// <summary>
    /// Retrieves all <see cref="Comment"/> entities from the data store.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. The task result contains a list of comments.</returns>
    Task<List<Comment>> GetAll();

    /// <summary>
    /// Retrieves a <see cref="Comment"/> entity by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the comment.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the comment entity if found; otherwise, <c>null</c>.
    /// </returns>
    Task<Comment?> GetById(string id);

    /// <summary>
    /// Adds a new <see cref="Comment"/> to the data store.
    /// </summary>
    /// <param name="comment">The comment entity to add.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task Add(Comment comment);

    /// <summary>
    /// Updates an existing <see cref="Comment"/> entity in the data store.
    /// </summary>
    /// <param name="comment">The comment entity to update.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task Update(Comment comment);

    /// <summary>
    /// Deletes a <see cref="Comment"/> entity from the data store.
    /// </summary>
    /// <param name="comment">The comment entity to delete.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task Delete(Comment comment);
}