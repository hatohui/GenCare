namespace Application.DTOs.Service.Responses;

public record class ViewServiceByPageResponse
{
    public int Page { get; set; }
    public int Count { get; set; }
    public List<ServicePayLoad> Payload { get; set; } 
    
}

