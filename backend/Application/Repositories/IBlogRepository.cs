using Domain.Entities;

namespace Application.Repositories;
/// <summary>
/// Defines methods for managing <see cref="Blog"/> entities in the data store.
/// </summary>
public interface IBlogRepository
{
    /// <summary>
    /// Retrieves all <see cref="Blog"/> entities from the data store.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. The task result contains a list of blogs.</returns>
    Task<List<Blog>> GetAll();

    /// <summary>
    /// Retrieves a <see cref="Blog"/> entity by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the blog.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the blog entity if found; otherwise, <c>null</c>.
    /// </returns>
    Task<Blog?> GetById(string id);

    /// <summary>
    /// Adds a new <see cref="Blog"/> to the data store.
    /// </summary>
    /// <param name="blog">The blog entity to add.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task Add(Blog blog);

    /// <summary>
    /// Updates an existing <see cref="Blog"/> entity in the data store.
    /// </summary>
    /// <param name="blog">The blog entity to update.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task Update(Blog blog);

    /// <summary>
    /// Deletes a <see cref="Blog"/> entity from the data store.
    /// </summary>
    /// <param name="blog">The blog entity to delete.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task Delete(Blog blog);
    
    Task<List<Blog>> GetListOfBlogsAsync();
    
    Task<List<Blog>> SearchBlogsAsync(string search);
    
    Task<List<Blog>> SearchBlogByTag(string tags);
    
 
}