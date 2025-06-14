namespace Application.DTOs.Service.Responses;

public record class ViewServiceByPageResponse
{
    public int TotalCount { get; set; }
    public List<ServicePayLoadForStaff> Services { get; set; }
}