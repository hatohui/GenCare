namespace Application.DTOs.Service.Responses;

public class ViewServiceResponse
{
    public string? Id { get; set; } 
    public string? Name { get; set; } 
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public Guid DeletedById { get; set; }
    public Guid CreatedById { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public List<string>? ImageUrls { get; set; }  

}