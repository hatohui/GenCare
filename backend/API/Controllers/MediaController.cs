using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;
[ApiController]
[Route("api/media")]
[Authorize(Roles = $"{RoleNames.Admin},{RoleNames.Manager}")]

public class MediaController(IMediaService mediaService) : ControllerBase
{
    [HttpDelete("{id}")]
    [Authorize(Roles = $"{RoleNames.Admin},{RoleNames.Manager}")]

    public async Task<ActionResult> DeleteMedia(Guid id)
    {
        var result = await mediaService.DeleteMediaAsync(id);
        if (!result.Success)
            return NotFound(result);

        return Ok(result);
    }
}