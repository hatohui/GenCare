namespace Application.DTOs.Service.Responses;

public class ViewServiceForUserResponse
{
    public int Total { get; set; }
    public List<ServicePayLoad> Services { get; set; }
}