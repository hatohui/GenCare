
namespace Application.DTOs.Auth.Requests;
public class ResetPasswordRequest
{
    public string? Email { get; set; }
    public string? NewPassword { get; set; }
    public string? ResetPasswordToken { get; set; }
}
