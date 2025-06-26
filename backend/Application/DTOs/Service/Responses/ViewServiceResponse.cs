namespace Application.DTOs.Service.Responses;

public class ViewServiceResponse
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public Guid DeletedBy { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public List<MediaServiceModel>? ImageUrls { get; set; }
}