namespace Application.DTOs.Slot.Request;

public class CreateSlotRequest
{
    public int No { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsDeleted { get; set; } = false;
}