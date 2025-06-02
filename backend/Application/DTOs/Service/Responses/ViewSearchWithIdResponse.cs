namespace Application.DTOs.Service.Responses;

public class ViewSearchWithIdResponse
{
    public string Id { get; set; } 
    public string Name { get; set; } 
    public string Description { get; set; }
    public decimal Price { get; set; }
    
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string IsDeleted { get; set; }
}