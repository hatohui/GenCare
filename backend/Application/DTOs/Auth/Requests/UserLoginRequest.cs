namespace Application.DTOs.Auth.Request;

public class UserLoginRequest
{
    public string? PhoneNumber { get; set; }
    public string? Password { get; set; }
}