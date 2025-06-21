using Application.DTOs.Tag.Request;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;
[ApiController]
[Route("api/tags")]
public class TagController(ITagService tagService) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = $"{RoleNames.Admin},{RoleNames.Manager}")]
    public async Task<IActionResult> CreateTag([FromBody] CreateTagRequest request)
    {
        var response = await tagService.CreateTagAsync(request);
        if (response.Success)
        {
            return Ok(response);
        }
        return BadRequest(response);
    }

    [HttpPut("{tagId}")]
    [Authorize(Roles = $"{RoleNames.Admin},{RoleNames.Manager}")]
    public async Task<IActionResult> UpdateTag( [FromBody] UpdateTagRequest request, Guid tagId)
    {
        
        //call service to update tag
        var response = await tagService.UpdateTagAsync(request, tagId);
        if (response.Success)
        {
            return Ok(response);
        }

        // return boolean response based on the service response
        if (response.Message == "Tag not found.")
        {
            return NotFound(response);
        }

     
        return BadRequest(response);
    }

    [HttpGet]
    public async Task<IActionResult> ViewAllTags()
    {
        var response = await tagService.ViewAllTagAsync();
        return Ok(response);
    }
    
}