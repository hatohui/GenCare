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

    public async Task<List<BlogTag>> GetByBlogId(string blogId)
    {
        Guid gBlogId = Guid.Parse(blogId);
        return await dbContext.BlogTags.Where(bl => Guid.Equals(bl.BlogId, gBlogId)).ToListAsync();
    }

    public async Task<List<BlogTag>> GetByTagId(string tagId)
    {
        Guid gTagId = Guid.Parse(tagId);
        return await dbContext.BlogTags.Where(bl => Guid.Equals(bl.TagId, gTagId)).ToListAsync();
    }

    public async Task Update(BlogTag blogTag)
    {
        dbContext.BlogTags.Update(blogTag);
        await dbContext.SaveChangesAsync();
    }
}
