namespace Application.DTOs.Result.Response;

public class ViewTestResultResponse
{
    public Guid OrderDetailId { get; set; }
    public DateTime OrderDate { get; set; }

    public DateTime? SampleDate { get; set; }

    public DateTime? ResultDate { get; set; }

    public bool? Status { get; set; }

    public Dictionary<string, TestItemResult>? ResultData { get; set; }

    public DateTime UpdatedAt { get; set; }
}