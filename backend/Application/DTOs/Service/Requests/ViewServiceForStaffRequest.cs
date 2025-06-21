namespace Application.DTOs.Service.Requests;

public class ViewServiceForStaffRequest
{
    public int Page { get; set; }
    public int Count { get; set; }
    public string? Search { get; set; }
    public bool? SortByPrice { get; set; }
    public bool? IncludeDeleted { get; set; }
    public bool? SortByUpdatedAt { get; set; }
}