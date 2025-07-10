namespace Application.DTOs.Account.Responses;

public class AccountCreateResponse
{
    public string Id { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public bool Gender { get; set; }
    public string PhoneNumber { get; set; } = null!;
    public DateOnly DateOfBirth { get; set; }
    public string? AvatarUrl { get; set; }
    public string Degree { get; set; } = null!;
    public int YearOfExperience { get; set; }
    public string? Biography { get; set; }
    public string DepartmentName { get; set; } = null!;
}