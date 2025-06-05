namespace Application.DTOs.Service.Requests;

public class CreateServiceRequest
{
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public decimal Price { get; set; }
    public string? UrlImage { get; set; } 
}