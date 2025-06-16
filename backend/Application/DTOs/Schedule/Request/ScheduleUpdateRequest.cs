namespace Application.DTOs.Schedule.Request;

public class ScheduleUpdateRequest
{
    public string ScheduleId { get; set; } = null!;
    public string? SlotId { get; set; }
    public string? AccountId { get; set; }
}