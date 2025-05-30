namespace Application.DTOs.Auth.Responses;

public class AccountLoginResponse
{
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime AccessTokenExpiration { get; set; }
}