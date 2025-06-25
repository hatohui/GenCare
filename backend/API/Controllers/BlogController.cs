using Application.DTOs.Blog.Request;
using Application.Helpers;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

/// <summary>
/// Controller for managing blog operations.
/// </summary>
[Route("api/blogs")]
[ApiController]
public class BlogController(IBlogService blogService) : ControllerBase
{
    /// <summary>
    /// Retrieves all blogs.
    /// </summary>
    /// <returns>A list of all blogs.</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllBlogs()
    {
        var blogs = await blogService.GetAllBlogsAsync();
        return Ok(blogs);
    }

    /// <summary>
    /// Adds a new blog.
    /// </summary>
    /// <param name="request">The blog creation request data.</param>
    /// <returns>A response indicating the result of the creation operation.</returns>
    [HttpPost]
    [Authorize(Roles = $"{RoleNames.Manager},{RoleNames.Admin},{RoleNames.Consultant},{RoleNames.Staff}")]
    public async Task<IActionResult> AddBlog([FromBody] BlogCreateRequest request)
    {
        //get access token from header
        var access = AuthHelper.GetAccessToken(HttpContext);
        //get account id by token
        var accountId = JwtHelper.GetAccountIdFromToken(access);
        await blogService.AddBlogAsync(request, accountId.ToString("D"));
        return Created();
    }

    /// <summary>
    /// Updates an existing blog.
    /// </summary>
    /// <param name="id">The ID of the blog to update.</param>
    /// <param name="request">The blog update request data.</param>
    /// <returns>A response indicating the result of the update operation.</returns>
    [HttpPut("{id}")]
    [Authorize(Roles = $"{RoleNames.Manager},{RoleNames.Admin},{RoleNames.Staff},{RoleNames.Consultant}")]
    public async Task<IActionResult> UpdateBlog([FromRoute] string id, [FromBody] BlogUpdateRequest request)
    {
        //get access token from header
        var access = AuthHelper.GetAccessToken(HttpContext);
        //get account id by token
        var accountId = JwtHelper.GetAccountIdFromToken(access);
        await blogService.UpdateBlogAsync(request, accountId.ToString("D"), id);
        return NoContent(); //204
    }

    /// <summary>
    /// Deletes a blog.
    /// </summary>
    /// <param name="id">The ID of the blog to delete.</param>
    /// <returns>A response indicating the result of the delete operation.</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = $"{RoleNames.Manager},{RoleNames.Admin},{RoleNames.Staff},{RoleNames.Consultant}")]
    public async Task<IActionResult> DeleteBlog([FromRoute] string id)
    {
        //get access token from header
        var access = AuthHelper.GetAccessToken(HttpContext);
        //get account id from token
        var accountId = JwtHelper.GetAccountIdFromToken(access);
        await blogService.DeleteBlogAsync(id, accountId.ToString("D"));
        return NoContent(); //204
    }
}