namespace Application.DTOs.Auth.Requests;

public record GoogleLoginRequest
{
    public string Credential { get; init; } = string.Empty;
}