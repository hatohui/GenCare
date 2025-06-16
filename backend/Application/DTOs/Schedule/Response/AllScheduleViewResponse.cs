using Application.DTOs.Schedule.Model;

namespace Application.DTOs.Schedule.Response;

public class AllScheduleViewResponse
{
    public List<AccountResponseModel> Acccounts { get; set; } = new List<AccountResponseModel>();
    public int No { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
}