using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Appointment.Request;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;
public class AppointmentService(IAccountRepository accountRepository,
    IAppointmentRepository appointmentRepository) : IAppointmentService
{
    public async Task CreateAppointmentAsync(AppointmentCreateRequest request, string accessId)
    {
        //find member by id
        var member = await accountRepository.GetAccountByIdAsync(Guid.Parse(request.MemberId));
        //find staff by id
        var staff = await accountRepository.GetAccountByIdAsync(Guid.Parse(request.StaffId));
        //create appointment
        Appointment appointment = new()
        {
            Member = member ?? throw new AppException(404, "member id is invalid"),
            Staff = staff ?? throw new AppException(404, "staff id is invalid"),
            ScheduleAt = DateTime.SpecifyKind(request.ScheduleAt, DateTimeKind.Unspecified),
            CreatedBy = Guid.Parse(accessId),
        };
        //save appointment
        await appointmentRepository.Add(appointment);
    }


}
