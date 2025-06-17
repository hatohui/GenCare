using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;
using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;
public class TagRepository(IApplicationDbContext dbContext) : ITagRepository
{
    public async Task Add(Tag tag)
    {
        await dbContext.Tags.AddAsync(tag);
        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Tag tag)
    {
        dbContext.Tags.Remove(tag);
        await dbContext.SaveChangesAsync();
    }

    public async Task<List<Tag>> GetAll()
    {
        return await dbContext.Tags
            .Include(t => t.BlogTags)
            .ToListAsync();
    }

    public async Task<Tag?> GetById(string id)
    {
        Guid gId = Guid.Parse(id);
        return await dbContext.Tags
            .Include(t => t.BlogTags)
            .FirstOrDefaultAsync(t => Guid.Equals(t.Id, gId));
    }

    public async Task Update(Tag tag)
    {
        dbContext.Tags.Update(tag);
        await dbContext.SaveChangesAsync();
    }
}
