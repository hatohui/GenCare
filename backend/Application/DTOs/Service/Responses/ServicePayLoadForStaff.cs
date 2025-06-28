namespace Application.DTOs.Service.Responses;

public class ServicePayLoadForStaff : ServicePayLoad
{
    public string? DeletedBy { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; }
    public List<MediaServiceModel>? ImageUrls { get; set; }}