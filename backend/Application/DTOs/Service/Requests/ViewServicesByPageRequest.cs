namespace Application.DTOs.Service.Requests;

public record class ViewServicesByPageRequest
{
    public int Page { get; set; }
    public int Count { get; set; }
    public string? Search { get; set; }
    public bool? SortByPrice { get; set; }
    public bool? IncludeDeleted { get; set; }
}