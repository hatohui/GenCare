using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Appointment.Request;
using Application.DTOs.Appointment.Response;

namespace Application.Services;
public interface IAppointmentService
{
    Task CreateAppointmentAsync(AppointmentCreateRequest request, string accessId);
    Task<List<AllAppointmentViewResponse>> ViewAllAppointmentsAsync();
    Task UpdateAppointmentAsync(AppointmentUpdateRequest request, string appointmentId);
}
