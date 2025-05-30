namespace Application.DTOs.Auth.Requests;

public record class AccountLoginRequest
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}