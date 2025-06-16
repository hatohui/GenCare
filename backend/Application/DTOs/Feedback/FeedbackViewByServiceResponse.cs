namespace Application.DTOs.Feedback;

public class FeedbackViewByServiceResponse
{
    public string Id { get; set; } = null!;
    public string Detail { get; set; } = null!;
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; }
    public string AccountId { get; set; } = null!;
    public string AccountName { get; set; } = null!;
    public string ServiceName { get; set; } = null!;
}