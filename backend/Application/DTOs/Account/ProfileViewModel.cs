using Application.DTOs.Role;

namespace Application.DTOs.Account;

public class ProfileViewModel
{
    public Guid Id { get; set; }
    public RoleViewModel Role { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public bool Gender { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsDeleted { get; set; }
    public string? Degree { get; set; }
    public int? YearOfExperience { get; set; }
    public string? Biography { get; set; }
    public string? PhoneNumber { get; set; }
}