namespace Application.DTOs.Purchase.Request;

public class OrderDetailRequest
{
    public Guid ServiceId { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public DateOnly DateOfBirth { get; set; }
    public bool Gender { get; set; }
}