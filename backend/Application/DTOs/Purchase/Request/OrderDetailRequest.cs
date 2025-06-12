namespace Application.DTOs.Purchase.Request;

public class OrderDetailRequest
{
    public Guid ServiceId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public bool Gender { get; set; }
}