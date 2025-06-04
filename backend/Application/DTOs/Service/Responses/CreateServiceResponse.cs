namespace Application.DTOs.Service.Responses;

public class CreateServiceResponse
{
    public string Id { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public decimal Price { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string IsDeleted { get; set; } = default!;
}