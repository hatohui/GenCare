namespace Domain.Entities;

public class Schedule
{
    public Guid Id { get; set; }

    public Guid SlotId { get; set; }

    public Guid AccountId { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual Slot Slot { get; set; } = null!;
}