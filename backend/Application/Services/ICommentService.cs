using Application.DTOs.Comment.Request;
using Application.DTOs.Comment.Response;

namespace Application.Services;
public interface ICommentService
{
    Task CreateCommentAsync(CommentCreateRequest request, string accountId);
    Task<List<CommentViewResponse>> GetCommentAsync(string blogId);
    Task UpdateComment(CommentUpdateRequest request, string commentId, string accountId);
}
