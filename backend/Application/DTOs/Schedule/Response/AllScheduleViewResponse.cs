using Application.DTOs.Schedule.Model;

namespace Application.DTOs.Schedule.Response;

public class AllScheduleViewResponse
{
    public Guid ScheduleId { get; set; }
    public List<AccountResponseModel> Accounts { get; set; } = new List<AccountResponseModel>();
    public int No { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
}
