using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Repositories;
public interface IFeedbackRepository
{
    Task Add(Feedback feedback);
    Task<List<Feedback>> GetAll();
    Task<Feedback?> GetById(string id);
    Task Update(Feedback feedback);
    Task Delete(Feedback feedback);
}
