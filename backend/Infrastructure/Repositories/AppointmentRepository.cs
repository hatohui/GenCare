using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class AppointmentRepository(IApplicationDbContext dbContext) : IAppointmentRepository
{
    public async Task Add(Appointment a)
    {
        await dbContext.Appointments.AddAsync(a);
        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Appointment a)
    {
        dbContext.Appointments.Remove(a);
        await dbContext.SaveChangesAsync();
    }

    public async Task<List<Appointment>> GetAll()
    {
        return await dbContext.Appointments
            .Include(a => a.Member)
            .Include(a => a.Staff)
            .ToListAsync();
    }

    public async Task<Appointment?> GetById(string id)
    {
        return await dbContext.Appointments
            .Include(a => a.Member)
            .Include(a => a.Staff)
            .FirstOrDefaultAsync(a => a.Id == Guid.Parse(id));
    }

    public async Task Update(Appointment a)
    {
        dbContext.Appointments.Update(a);
        await dbContext.SaveChangesAsync();
    }

    public async Task<List<Appointment>> GetOverlappedAppointmentsForStaff(Guid staffId, DateTime start)
    {
        var end = start.AddHours(2);
        return await dbContext.Appointments
            .Where(a =>
                a.Staff.Id == staffId &&
                a.ScheduleAt < end &&
                a.ScheduleAt.AddHours(2) > start
            )
            .ToListAsync();
    }
}