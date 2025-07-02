namespace Application.DTOs.Result.Request;

public class UpdateTestResultRequest
{
    public DateTime? OrderDate { get; set; }

    public DateTime? SampleDate { get; set; }

    public DateTime? ResultDate { get; set; }

    public bool? Status { get; set; }

    public Dictionary<string, TestItemResult>? ResultData { get; set; }
}