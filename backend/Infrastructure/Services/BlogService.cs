using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Blog.Response;
using Application.Repositories;
using Application.Services;

namespace Infrastructure.Services;
public class BlogService(IBlogRepository blogRepository) : IBlogService
{
    public async Task<List<AllBlogViewResponse>> GetAllBlogsAsync()
    {
        var list = await blogRepository.GetAll();
        List<AllBlogViewResponse> rs = new();
        foreach (var blog in list)
        {
            rs.Add(new AllBlogViewResponse()
            {
                Id = blog.Id.ToString("D"),
                Title = blog.Title,
                Content = blog.Content,
                Author = blog.Author,
                CreatedAt = blog.CreatedAt,
                PublishedAt = blog.PublishedAt,
                CreatedBy = blog.CreatedBy?.ToString("D"),
                UpdatedAt = blog.UpdatedAt,
                UpdatedBy = blog.UpdatedBy?.ToString("D"),
                DeletedAt = blog.DeletedAt,
                DeletedBy = blog.DeletedBy?.ToString("D"),
                IsDeleted = blog.IsDeleted
            });
        }
        return rs;
    }
}
