namespace Application.DTOs.Slot.Model;

public class AccountInforView
{
    public Guid Id { get; set; }

    public Guid RoleId { get; set; }

    public string Email { get; set; } = null!;

    public string? PasswordHash { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Phone { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public bool Gender { get; set; }

    public string? AvatarUrl { get; set; }
    public List<ScheduleStaff> Schedules { get; set; }

}