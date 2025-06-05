namespace Application.DTOs.Service.Requests;

public class UpdateServiceRequest
{
    public Guid Id { get; init; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public bool IsDeleted { get; set; }
    public List<string>? ImageUrls { get; set; }
}