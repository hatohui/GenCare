namespace Application.DTOs.Auth.Requests;
public record class ResetPasswordRequest
{
    public string Email { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
    public string ResetPasswordToken { get; set; } = null!;
}