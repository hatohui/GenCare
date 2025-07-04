namespace Application.DTOs.Purchase;

public class BookedServiceModel
{
    public Guid OrderDetailId { get; set; }
    public string ServiceName { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public DateTime DateOfBirth { get; set; }
    public bool Gender { get; set; }
    public DateTime CreatedAt { get; set; }

    public bool? Status { get; set; }
}