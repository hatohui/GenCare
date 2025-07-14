using Application.DTOs.Purchase;

namespace Application.DTOs.Result.Response;

public class BookedServiceForTestResponse
{
    public List<BookedServiceModel> Result { get; set; } = new();
    public int TotalCount { get; set; }
}