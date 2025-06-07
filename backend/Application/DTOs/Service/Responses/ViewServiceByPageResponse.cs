namespace Application.DTOs.Service.Responses;

public record class ViewServiceByPageResponse
{
    public int Page { get; set; }
    public int Count { get; set; }
    public List<ServicePayload>? Payload { get; set; } 
    
}

public class ServicePayload
{
    public Guid Id { get; set; } 
    public string? Name { get; set; } 
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty; 
}