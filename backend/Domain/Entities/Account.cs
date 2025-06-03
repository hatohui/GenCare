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

    public ICollection<Appointment> AppointmentMember { get; set; } = [];

    public ICollection<Appointment> AppointmentStaff { get; set; } = [];

    public BirthControl? BirthControl { get; set; }

    public ICollection<Comment> Comment { get; set; } = [];

    public ICollection<Conversation> ConversationMember { get; set; } = [];

    public ICollection<Conversation> ConversationStaff { get; set; } = [];

    public ICollection<Purchase> Purchase { get; set; } = [];

    public ICollection<RefreshToken> RefreshToken { get; set; } = [];

    public Role Role { get; set; } = null!;

    public ICollection<Schedule> Schedule { get; set; } = [];

    public StaffInfo? StaffInfo { get; set; }
}