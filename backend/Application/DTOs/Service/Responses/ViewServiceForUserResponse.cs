namespace Application.DTOs.Service.Responses;

public class ViewServiceForUserResponse
{
    public int TotalCount { get; set; }
    public List<ServicePayLoad> Services { get; set; }
}