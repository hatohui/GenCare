namespace Domain.Entities;

public class Department
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public virtual ICollection<StaffInfo> StaffInfo { get; set; } = [];
}