namespace Application.DTOs.Auth.Requests;

public record class AccountRegisterRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool Gender { get; set; }
    public string PhoneNumber { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public DateOnly? DateOfBirth { get; set; }
}