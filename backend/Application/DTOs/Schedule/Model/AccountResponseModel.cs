namespace Application.DTOs.Schedule.Model;

public class AccountResponseModel
{
    public string Id { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? DateOfBirth { get; set; }
    public bool? Gender { get; set; }
    public string? AvatarUrl { get; set; }
}
