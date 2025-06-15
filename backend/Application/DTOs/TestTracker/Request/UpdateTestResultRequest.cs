namespace Application.DTOs.TestTracker.Request;

public class UpdateTestResultRequest
{
    public Guid OrderDetailId { get; set; }
    public DateTime? OrderDate { get; set; }
    
    public DateTime? SampleDate { get; set; }
    
    public DateTime? ResultDate { get; set; }
    
    public bool? Status { get; set; }
    
    public string? ResultData { get; set; }
    
    
}