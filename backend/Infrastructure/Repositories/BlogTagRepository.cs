using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;
public class BlogTagRepository(IApplicationDbContext dbContext) : IBlogTagRepository
{
    public async Task Add(BlogTag blogTag)
    {
        await dbContext.BlogTags.AddAsync(blogTag);
        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(BlogTag blogTag)
    {
        dbContext.BlogTags.Remove(blogTag);
        await dbContext.SaveChangesAsync();
    }

    public async Task<List<BlogTag>> GetAll()
    {
        return await dbContext.BlogTags
            .Include(bt => bt.Blog)
            .Include(bt => bt.Tag)
            .ToListAsync();
    }

    public Task<BlogTag?> GetByBlogId(string blogId)
    {
        Guid gBlogId = Guid.Parse(blogId);
        return dbContext.BlogTags
            .Include(bt => bt.Blog)
            .Include(bt => bt.Tag)
            .FirstOrDefaultAsync(bt => Guid.Equals(bt.BlogId, gBlogId));
    }

    public Task<BlogTag?> GetByTagId(string tagId)
    {
        Guid gTagId = Guid.Parse(tagId);
        return dbContext.BlogTags
            .Include(bt => bt.Blog)
            .Include(bt => bt.Tag)
            .FirstOrDefaultAsync(bt => Guid.Equals(bt.TagId, gTagId));
    }

    public async Task Update(BlogTag blogTag)
    {
        dbContext.BlogTags.Update(blogTag);
        await dbContext.SaveChangesAsync();
    }
}
