﻿using System;
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
