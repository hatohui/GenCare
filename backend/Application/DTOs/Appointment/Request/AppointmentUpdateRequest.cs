namespace Application.DTOs.Appointment.Request;

public class AppointmentUpdateRequest
{
    public string? MemberId { get; set; }
    public string? StaffId { get; set; }
    public DateTime? ScheduleAt { get; set; }
    public string? JoinUrl { get; set; }
}