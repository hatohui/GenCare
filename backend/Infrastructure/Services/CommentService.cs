using Application.DTOs.Comment.Request;
using Application.DTOs.Comment.Response;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;
public class CommentService(IBlogRepository blogRepository,
    IAccountRepository accountRepository,
    ICommentRepository commentRepository) : ICommentService
{
    public async Task CreateCommentAsync(CommentCreateRequest request, string accountId)
    {
        //get blog by id
        var blog = await blogRepository.GetById(request.BlogId);
        //get account by id
        var account = await accountRepository.GetAccountByIdAsync(Guid.Parse(accountId));
        if (blog is null || account is null)
        {
            throw new AppException(404, "Blog or account not found");
        }
        //create comment
        Comment comment = new()
        {
            Content = request.Content,
            Blog = blog,
            Account = account,
            CreatedAt = DateTime.Now,
            CreatedBy = account.Id,
            UpdatedAt = DateTime.Now
        };
        await commentRepository.Add(comment);
    }

    public async Task<List<CommentViewResponse>> GetCommentAsync(string blogId)
    {
        //get blog by id
        var blog = await blogRepository.GetById(blogId);
        if (blog is null)
            throw new AppException(404, "Blog is not found");
        List<CommentViewResponse> rs = new();
        //for each comments in blog
        foreach (var comment in blog.Comments)
        {
            //get account of comment
            var account = await accountRepository.GetAccountByIdAsync(comment.AccountId);
            rs.Add(new CommentViewResponse
            {
                Id = comment.Id.ToString("D"),
                Content = comment.Content,
                AccountId = comment.AccountId.ToString("D"),
                AccountName = $"{account!.FirstName} {account!.LastName}",
                CreatedAt = comment.CreatedAt,
                UpdatedAt = comment.UpdatedAt,
                UpdatedBy = comment.UpdatedBy?.ToString("D"),
                DeletedAt = comment.DeletedAt,
                DeletedBy = comment.DeletedBy?.ToString("D"),
                IsDeleted = comment.IsDeleted
            });
        }
        return rs;
    }

    public async Task UpdateCommentAsync(CommentUpdateRequest request, string commentId, string accountId)
    {
        //get comment by id
        var comment = await commentRepository.GetById(commentId);
        if (comment is null)
        {
            throw new AppException(404, "Comment not found");
        }
        if (comment.AccountId.ToString("D") != accountId)
        {
            throw new AppException(403, "You are not allowed to update this comment");
        }
        //update comment
        comment.Content = request.Content;
        comment.UpdatedAt = DateTime.Now;
        comment.UpdatedBy = Guid.Parse(accountId);
        await commentRepository.Update(comment);
    }

    public async Task DeleteCommentAsync(string commentId, string accountId)
    {
        //get comment by id
        var comment = await commentRepository.GetById(commentId);
        if (comment is null)
        {
            throw new AppException(404, "Comment not found");
        }
        if (comment.AccountId.ToString("D") != accountId)
        {
            throw new AppException(403, "You are not allowed to delete this comment");
        }
        //delete comment
        comment.DeletedAt = DateTime.Now;
        comment.DeletedBy = Guid.Parse(accountId);
        comment.IsDeleted = true;
        await commentRepository.Update(comment);
    }

    public async Task LikeCommentAsync(Guid commentId, string accountId)
    {
        //get comment by id
        var comment = await commentRepository.GetById(commentId.ToString("D"));
        if (comment is null)
        {
            throw new AppException(404, "Comment not found");
        }
        //check if account already liked this comment
        if (comment.Likes > 0 && comment.AccountId.ToString("D") == accountId)
        {
            throw new AppException(400, "You have already liked this comment");
        }
        //like comment
        comment.Likes++;
        await commentRepository.Update(comment);
    }
}
