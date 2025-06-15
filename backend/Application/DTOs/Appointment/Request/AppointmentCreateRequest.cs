using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Appointment.Request;
public class AppointmentCreateRequest
{
    public String MemberId { get; set; } = null!;
    public String StaffId { get; set; } = null!;
    public DateTime ScheduleAt { get; set; }
}
