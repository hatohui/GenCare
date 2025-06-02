namespace Application.DTOs.Auth.Responses;

public record AccountRegisterResponse
{
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
    public DateTime AccessTokenExpiration { get; set; }
}
