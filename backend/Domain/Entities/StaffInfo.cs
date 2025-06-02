namespace Domain.Entities;

public class StaffInfo
{
    public Guid AccountId { get; set; }

    public Guid DepartmentId { get; set; }

    public string Degree { get; set; } = null!;

    public int YearOfExperience { get; set; }

    public string Biography { get; set; } = null!;

    public virtual Account Account { get; set; } = null!;

    public virtual Department Department { get; set; } = null!;
}