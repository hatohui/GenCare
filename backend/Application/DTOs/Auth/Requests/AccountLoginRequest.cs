namespace Application.DTOs.Auth.Requests;

public record class UserLoginRequest
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}