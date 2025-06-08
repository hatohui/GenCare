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

    public ICollection<Appointment> AppointmentMembers { get; set; } = [];

    public ICollection<Appointment> AppointmentStaffs { get; set; } = [];

    public BirthControl? BirthControl { get; set; }

    public ICollection<Comment> Comments { get; set; } = [];

    public ICollection<Conversation> ConversationMembers { get; set; } = [];

    public ICollection<Conversation> ConversationStaffs { get; set; } = [];

    public ICollection<Purchase> Purchases { get; set; } = [];

    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];

    public Role Role { get; set; } = null!;

    public ICollection<Schedule> Schedules { get; set; } = [];

    public StaffInfo? StaffInfo { get; set; }
}