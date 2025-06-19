namespace Application.DTOs.Comment.Response;

public class CommentViewResponse
{
    public string Id { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string AccountId { get; set; } = null!;
    public string? AccountName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; }
    public bool IsDeleted { get; set; }
}