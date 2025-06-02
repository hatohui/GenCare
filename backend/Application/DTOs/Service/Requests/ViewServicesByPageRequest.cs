namespace Application.DTOs.Service.Requests;

public record class ViewServicesByPageRequest
{
    public int Page { get; set; }
    public int Count { get; set; }

}