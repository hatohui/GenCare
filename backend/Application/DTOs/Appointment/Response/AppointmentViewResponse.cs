using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Appointment.Response;
public class AppointmentViewResponse
{
    public string MemberId { get; set; } = null!;
    public string MemberName { get; set; } = null!;
    public string StaffId { get; set; } = null!;
    public string StaffName { get; set; } = null!;
    public DateTime ScheduleAt { get; set; }
    public string? JoinUrl { get; set; }
    public bool IsDeleted { get; set; }
    public string Status { get; set; } = null!;
}
