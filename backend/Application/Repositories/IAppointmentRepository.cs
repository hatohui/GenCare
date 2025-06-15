
using Domain.Entities;

namespace Application.Repositories;
public interface IAppointmentRepository
{
    Task<List<Appointment>> GetAll();
    Task<Appointment?> GetById(string id);
    Task Add(Appointment a);
    Task Delete(Appointment a);
    Task Update(Appointment a);
}
