using Application.DTOs.Comment.Request;
using Application.DTOs.Comment.Response;

namespace Application.Services;
/// <summary>
/// Provides comment management operations.
/// </summary>
public interface ICommentService
{
    /// <summary>
    /// Creates a new comment for a blog post.
    /// </summary>
    /// <param name="request">The comment creation request data.</param>
    /// <param name="accountId">The ID of the account creating the comment.</param>
    Task CreateCommentAsync(CommentCreateRequest request, string accountId);

    /// <summary>
    /// Retrieves all comments for a specific blog post.
    /// </summary>
    /// <param name="blogId">The ID of the blog post.</param>
    /// <returns>A list of <see cref="CommentViewResponse"/> representing the comments.</returns>
    Task<List<CommentViewResponse>> GetCommentAsync(string blogId);

    /// <summary>
    /// Updates an existing comment.
    /// </summary>
    /// <param name="request">The comment update request data.</param>
    /// <param name="commentId">The ID of the comment to update.</param>
    /// <param name="accountId">The ID of the account updating the comment.</param>
    Task UpdateCommentAsync(CommentUpdateRequest request, string commentId, string accountId);

    /// <summary>
    /// Deletes a comment.
    /// </summary>
    /// <param name="commentId">The ID of the comment to delete.</param>
    /// <param name="accountId">The ID of the account performing the deletion.</param>
    Task DeleteCommentAsync(string commentId, string accountId);
}