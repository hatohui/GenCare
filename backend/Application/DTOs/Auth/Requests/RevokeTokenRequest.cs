namespace Application.DTOs.Auth.Requests;

public class RevokeTokenRequest
{
    public string RefreshToken { get; set; } = string.Empty;
}