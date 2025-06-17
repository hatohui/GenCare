namespace Application.DTOs.Message.Response;

public class MessageResponse
{
    public Guid Id { get; set; }
    public string Content { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public Guid CreatedBy { get; set; }
    public List<string> MediaUrls { get; set; } = [];
}