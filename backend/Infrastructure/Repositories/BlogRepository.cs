
using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;
public class BlogRepository(IApplicationDbContext dbContext) : IBlogRepository
{
    public async Task Add(Blog blog)
    {
        await dbContext.Blogs.AddAsync(blog);
        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Blog blog)
    {
        dbContext.Blogs.Remove(blog);
        await dbContext.SaveChangesAsync();
    }

    public async Task<List<Blog>> GetAll()
    {
        return await dbContext.Blogs
            .Include(b => b.Comments)
            .Include(b => b.Media)
            .Include(b => b.BlogTags)
            .ThenInclude(bt => bt.Tag)
            .ToListAsync();
    }

    public async Task<Blog?> GetById(string id)
    {
        Guid gId = Guid.Parse(id);
        return await dbContext.Blogs
            .Include(b => b.Comments)
            .Include(b => b.Media)
            .Include(b => b.BlogTags)
            .ThenInclude(bt => bt.Tag)
            .FirstOrDefaultAsync(b => Guid.Equals(b.Id, gId));
    }

    public async Task Update(Blog blog)
    {
        dbContext.Blogs.Update(blog);
        await dbContext.SaveChangesAsync();
    }
}
