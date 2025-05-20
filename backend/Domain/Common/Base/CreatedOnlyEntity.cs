namespace Domain.Common.Base;

public abstract class CreatedOnlyEntity
{
    public DateTime CreatedAt { get; set; }
    public int CreatedBy { get; set; }
}
