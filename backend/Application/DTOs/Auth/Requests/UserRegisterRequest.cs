namespace Application.DTOs.Auth.Requests;

public record class UserRegisterRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string ConfirmedPassword { get; set; } = null!;
    public DateOnly? DateOfBirth { get; set; }
}