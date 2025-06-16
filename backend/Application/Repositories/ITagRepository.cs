using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Repositories;
public interface ITagRepository
{
    Task<List<Tag>> GetAll();
    Task<Tag?> GetById(string id);
    //add
    Task Add(Tag tag);
    //update
    Task Update(Tag tag);
    //delete
    Task Delete(Tag tag);
}
