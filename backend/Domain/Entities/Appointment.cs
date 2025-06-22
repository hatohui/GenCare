using Domain.Common.Enums;

namespace Domain.Entities;

public class Appointment
{
    public Guid Id { get; set; }

    public Guid MemberId { get; set; }

    public Guid StaffId { get; set; }

    public DateTime ScheduleAt { get; set; }

    public string? JoinUrl { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Guid? UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public AppointmentStatus Status { get; set; }

    public Account Member { get; set; } = null!;

    public Account Staff { get; set; } = null!;
}