namespace Application.DTOs.TestTracker.Response;

public class ViewTestResultResponse
{
    public DateTime OrderDate { get; set; }
    
    public DateTime? SampleDate { get; set; }
    
    public DateTime? ResultDate { get; set; }
    
    public bool? Status { get; set; }
    
    public string? ResultData { get; set; }
    
    public DateTime UpdatedAt { get; set; }
}