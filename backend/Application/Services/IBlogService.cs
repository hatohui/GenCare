
using Application.DTOs.Blog.Response;

namespace Application.Services;
public interface IBlogService
{
    Task<List<AllBlogViewResponse>> GetAllBlogsAsync();
}
