namespace Application.DTOs.Auth.Responses;

public record class SearchServicesResponse
{
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public decimal? Price { get; set; }

}