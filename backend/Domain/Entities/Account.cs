namespace Domain.Entities;

public class Account
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

    public DateTime CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Guid? UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public virtual ICollection<Appointment> AppointmentMember { get; set; } = [];

    public virtual ICollection<Appointment> AppointmentStaff { get; set; } = [];

    public virtual BirthControl? BirthControl { get; set; }

    public virtual ICollection<Comment> Comment { get; set; } = [];

    public virtual ICollection<Conversation> ConversationMember { get; set; } = [];

    public virtual ICollection<Conversation> ConversationStaff { get; set; } = [];

    public virtual ICollection<Purchase> Purchase { get; set; } = [];

    public virtual ICollection<RefreshToken> RefreshToken { get; set; } = [];

    public virtual Role Role { get; set; } = null!;

    public virtual ICollection<Schedule> Schedule { get; set; } = [];

    public virtual StaffInfo? StaffInfo { get; set; }
}