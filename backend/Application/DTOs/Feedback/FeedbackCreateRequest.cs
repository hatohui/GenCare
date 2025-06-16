namespace Application.DTOs.Feedback;

public class FeedbackCreateRequest
{
    public string Detail { get; set; } = null!;
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; }
    public string ServiceId { get; set; } = null!;
}