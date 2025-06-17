using Application.DTOs.Blog.Request;
using Application.Helpers;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
[Route("api/[controller]")]
[ApiController]
public class BlogController(IBlogService blogService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllBlogs()
    {
        var blogs = await blogService.GetAllBlogsAsync();
        return Ok(blogs);
    }

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
