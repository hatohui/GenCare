namespace Domain.Entities;

public   class Slot
{
    public Guid Id { get; set; }

    public int No { get; set; }

    public DateTime StartAt { get; set; }

    public DateTime EndAt { get; set; }

    public bool IsDeleted { get; set; }

    public   ICollection<Schedule> Schedule { get; set; } = [];
}