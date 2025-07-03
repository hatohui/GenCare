using Application.DTOs.Blog.Request;
using Application.DTOs.Blog.Response;

namespace Application.Services
{
    /// <summary>
    /// Provides blog management operations.
    /// </summary>
    public interface IBlogService
    {
        /// <summary>
        /// Retrieves all blogs.
        /// </summary>
        /// <returns>A list of <see cref="AllBlogViewResponse"/> representing all blogs.</returns>
        Task<List<AllBlogViewResponse>> GetAllBlogsAsync();

        /// <summary>
        /// Adds a new blog.
        /// </summary>
        /// <param name="request">The blog creation request data.</param>
        /// <param name="accountId">The ID of the account creating the blog.</param>
        Task AddBlogAsync(BlogCreateRequest request, string accountId);

        /// <summary>
        /// Updates an existing blog.
        /// </summary>
        /// <param name="request">The blog update request data.</param>
        /// <param name="accountId">The ID of the account updating the blog.</param>
        /// <param name="blogId">The ID of the blog to update.</param>
        Task UpdateBlogAsync(BlogUpdateRequest request, string accountId, string blogId);

        /// <summary>
        /// Deletes a blog.
        /// </summary>
        /// <param name="blogId">The ID of the blog to delete.</param>
        /// <param name="accountId">The ID of the account performing the deletion.</param>
        Task DeleteBlogAsync(string blogId, string accountId);
        
        Task<List<ListOfBlogResponse>> GetListOfBlogsAsync(ViewListOfBlogRequest request);
    }
}