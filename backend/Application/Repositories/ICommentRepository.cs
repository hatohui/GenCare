using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Repositories;
public interface ICommentRepository
{
    Task<List<Comment>> GetAll();
    Task<Comment?> GetById(string id);
    //add
    Task Add(Comment comment);
    //update
    Task Update(Comment comment);
    //delete
    Task Delete(Comment comment);
}
