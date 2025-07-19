using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;
public class CommentRepository(IApplicationDbContext dbContext) : ICommentRepository
{
    public async Task Add(Comment comment)
    {
        await dbContext.Comments.AddAsync(comment);
        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Comment comment)
    {
        dbContext.Comments.Remove(comment);
        await dbContext.SaveChangesAsync();
    }

    public async Task<int> GetLikesCountByBlogIdAsync(Guid blogId)
    {
        var blog = await dbContext.Blogs
            .Where(b => b.Id == blogId && !b.IsDeleted)
            .Select(b => b.Likes)
            .FirstOrDefaultAsync();
    
        return blog;
    }

    public async Task<int> GetCommentsCountByBlogIdAsync(Guid blogId)
    {
        return await dbContext.Comments
            .CountAsync(c => c.BlogId == blogId);
    }

    public async Task<List<Comment>> GetAll()
    {
        return await dbContext.Comments
            .Include(c => c.Blog)
            .Include(c => c.Account)
            .ToListAsync();
    }

    public async Task<Comment?> GetById(string id)
    {
        Guid gId = Guid.Parse(id);
        return await dbContext.Comments
            .Include(c => c.Blog)
            .Include(c => c.Account)
            .FirstOrDefaultAsync(c => Guid.Equals(c.Id, gId));
    }

    public async Task Update(Comment comment)
    {
        dbContext.Comments.Update(comment);
        await dbContext.SaveChangesAsync();
    }
}
