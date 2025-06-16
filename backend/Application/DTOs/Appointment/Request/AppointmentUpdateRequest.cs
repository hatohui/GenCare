using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.DTOs.Appointment.Request;
public class AppointmentUpdateRequest
{
    public string? MemberId { get; set; }
    public string? StaffId { get; set; }
    public DateTime? ScheduleAt { get; set; }
    public string? JoinUrl { get; set; }
}
