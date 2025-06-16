using Application.DTOs.Schedule.Model;

namespace Application.DTOs.Schedule.Response;

public class ScheduleViewResponse
{
    public AccountResponseModel Account { get; set; } = null!;
    public List<SlotResponseModel> Slots { get; set; } = new List<SlotResponseModel>();
}