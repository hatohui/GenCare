namespace Application.DTOs.Service.Requests;

public class UpdateServiceRequest
{
    
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public bool IsDeleted { get; set; }
    public List<string>? ImageUrls { get; set; }
}