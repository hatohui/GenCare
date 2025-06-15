using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Appointment.Request;

namespace Application.Services;
public interface IAppointmentService
{
    Task CreateAppointmentAsync(AppointmentCreateRequest request, string accessId);
}
