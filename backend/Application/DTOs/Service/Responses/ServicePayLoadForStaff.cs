namespace Application.DTOs.Service.Responses;

public class ServicePayLoadForStaff : ServicePayLoad
{
    public string? DeletedById { get; set; }
    public string? CreatedById { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedById { get; set; }
    public bool IsDeleted { get; set; }
    public List<string>? ImageUrls { get; set; }  
}