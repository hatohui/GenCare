namespace Application.DTOs.Account;

public class StaffAccountCreateModel
{
    public string Email { get; set; } = null!;
    public string RoleId { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string AvatarUrl { get; set; } = null!;
    public bool Gender { get; set; }
    public string PhoneNumber { get; set; } = null!;
    public DateOnly DateOfBirth { get; set; }
    public string Password { get; set; } = null!;
}