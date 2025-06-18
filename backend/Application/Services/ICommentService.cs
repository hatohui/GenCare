using Application.DTOs.Comment.Request;

namespace Application.Services;
public interface ICommentService
{
    Task CreateCommentAsync(CommentCreateRequest request, string accountId);
}
