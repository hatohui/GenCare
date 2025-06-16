

using Domain.Entities;

namespace Application.Repositories;
public interface IBlogRepository
{
    Task<List<Blog>> GetAll();
    Task<Blog?> GetById(string id);
    //add
    Task Add(Blog blog);
    //update
    Task Update(Blog blog);
    //delete
    Task Delete(Blog blog);
}
