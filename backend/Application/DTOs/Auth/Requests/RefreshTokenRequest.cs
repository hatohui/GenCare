namespace Application.DTOs.Auth.Requests;

public record RefreshTokenRequest
{
    public string RefreshToken { get; set; } = null!;
}