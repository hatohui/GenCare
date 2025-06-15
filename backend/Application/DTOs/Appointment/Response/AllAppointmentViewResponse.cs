using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Common.Enums;

namespace Application.DTOs.Appointment.Response;
public class AllAppointmentViewResponse
{
    public String Id { get; set; } = null!;
    public String MemberId { get; set; } = null!;
    public String MemberName { get; set; } = null!;
    public String StaffId { get; set; } = null!;
    public String StaffName { get; set; } = null!;
    public DateTime ScheduleAt { get; set; }
    public String? JoinUrl { get; set; }

}
