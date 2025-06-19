namespace Application.DTOs.Slot.Response;

public record class UpdateSlotResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
}