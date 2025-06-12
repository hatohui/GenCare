namespace Application.DTOs.Auth.Requests;
public record class BookingServiceRequest
{
    public string? AccessToken { get; set; }
    public List<Guid>? ServiceIds { get; set; }
}