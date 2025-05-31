namespace Application.DTOs.Auth.Requests;

public record AccountLoginRequest
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}
