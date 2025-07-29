namespace Application.DTOs.Slot.Response;

public class CreateSlotResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public Guid SlotId { get; set; }
}
