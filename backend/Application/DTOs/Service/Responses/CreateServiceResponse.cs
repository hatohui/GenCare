namespace Application.DTOs.Service.Responses;

public class CreateServiceResponse
{
    public string? Id { get; set; }
    public string? Name { get; set; } 
    public string? Description { get; set; } 
    public string? UrlImage { get; set; } 
    public decimal Price { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsDeleted { get; set; } 
}