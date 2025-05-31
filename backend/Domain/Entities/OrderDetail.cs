namespace Domain.Entities;

public class OrderDetail
{
    public Guid Id { get; set; }

    public Guid PurchaseId { get; set; }

    public Guid ServiceId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    public bool Gender { get; set; }

    public Purchase Purchase { get; set; } = null!;

    public Result? Result { get; set; }

    public Service Service { get; set; } = null!;
}