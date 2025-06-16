using Domain.Entities;

namespace Application.Repositories;
/// <summary>
/// Defines methods for managing <see cref="BlogTag"/> entities in the data store.
/// </summary>
public interface IBlogTagRepository
{
    /// <summary>
    /// Retrieves all <see cref="BlogTag"/> entities from the data store.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. The task result contains a list of blog tags.</returns>
    Task<List<BlogTag>> GetAll();

    /// <summary>
    /// Retrieves a <see cref="BlogTag"/> entity by its associated blog identifier.
    /// </summary>
    /// <param name="blogId">The unique identifier of the blog.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the blog tag entity if found; otherwise, <c>null</c>.
    /// </returns>
    Task<BlogTag?> GetByBlogId(string blogId);

    /// <summary>
    /// Retrieves a <see cref="BlogTag"/> entity by its associated tag identifier.
    /// </summary>
    /// <param name="tagId">The unique identifier of the tag.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the blog tag entity if found; otherwise, <c>null</c>.
    /// </returns>
    Task<BlogTag?> GetByTagId(string tagId);

    /// <summary>
    /// Adds a new <see cref="BlogTag"/> to the data store.
    /// </summary>
    /// <param name="blogTag">The blog tag entity to add.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task Add(BlogTag blogTag);

    /// <summary>
    /// Updates an existing <see cref="BlogTag"/> entity in the data store.
    /// </summary>
    /// <param name="blogTag">The blog tag entity to update.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task Update(BlogTag blogTag);

    /// <summary>
    /// Deletes a <see cref="BlogTag"/> entity from the data store.
    /// </summary>
    /// <param name="blogTag">The blog tag entity to delete.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task Delete(BlogTag blogTag);
}