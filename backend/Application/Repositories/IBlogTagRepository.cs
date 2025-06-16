
using Domain.Entities;

namespace Application.Repositories;
public interface IBlogTagRepository
{
    Task<List<BlogTag>> GetAll();
    Task<BlogTag?> GetByBlogId(string blogId);
    Task<BlogTag?> GetByTagId(string tagId);
    //add
    Task Add(BlogTag blogTag);
    //update
    Task Update(BlogTag blogTag);
    //delete
    Task Delete(BlogTag blogTag);
}
