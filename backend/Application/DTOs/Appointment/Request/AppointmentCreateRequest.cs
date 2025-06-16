namespace Application.DTOs.Appointment.Request;

public class AppointmentCreateRequest
{
    public String MemberId { get; set; } = null!;
    public String StaffId { get; set; } = null!;
    public DateTime ScheduleAt { get; set; }
}