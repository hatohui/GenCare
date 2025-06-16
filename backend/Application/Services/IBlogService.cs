
using Application.DTOs.Blog.Request;
using Application.DTOs.Blog.Response;

namespace Application.Services;
public interface IBlogService
{
    Task<List<AllBlogViewResponse>> GetAllBlogsAsync();
    Task AddBlogAsync(BlogCreateRequest request);
}
