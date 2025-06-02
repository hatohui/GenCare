namespace Domain.Entities;

public class BirthControl
{
    public Guid AccountId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public DateTime? StartSafeDate { get; set; }

    public DateTime? EndSafeDate { get; set; }

    public DateTime? StartUnsafeDate { get; set; }

    public DateTime? EndUnsafeDate { get; set; }

    public Account Account { get; set; } = null!;
}