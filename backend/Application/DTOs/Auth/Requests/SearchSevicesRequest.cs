namespace Application.DTOs.Auth.Requests;

public record class SearchServicesRequest
{
    public string?  Name { get; set; } 
    public decimal? Price { get; set; }

}