namespace Application.DTOs.Comment.Request;
public class CommentCreateRequest
{
    public string BlogId { get; set; } = null!;
    public string Content { get; set; } = null!;
}
