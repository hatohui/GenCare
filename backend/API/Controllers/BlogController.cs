using Application.Services;
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
}
