namespace Application.DTOs.Auth.Requests;
public record class ForgotPasswordRequest
{
    public string Email { get; set; } = null!;
}
