using System.ComponentModel.DataAnnotations.Schema;
using Domain.Common.BaseEntities;
using Domain.Common.Enums;

namespace Domain.Entities;

public class Appointment : SoftDeletableEntity
{
    public Guid Id { get; set; }

    public Guid MemberId { get; set; }

    public Guid StaffId { get; set; }

    public DateTime ScheduleAt { get; set; }

    public string? JoinUrl { get; set; }

    public Guid? UpdateBy { get; set; }

    public Account Member { get; set; } = null!;

    public Account Staff { get; set; } = null!;

    [Column("status")]
    public AppointmentStatus Status { get; set; }
}