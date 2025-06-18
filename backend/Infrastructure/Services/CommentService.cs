using Application.DTOs.Comment.Request;
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
}
