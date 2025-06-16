namespace Application.DTOs.Schedule.Request;

public class ScheduleCreateRequest
{
    public string SlotId { get; set; } = null!;
    public string AccountId { get; set; } = null!;
}