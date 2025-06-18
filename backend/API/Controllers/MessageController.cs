using Application.DTOs.Message.Request;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;
[ApiController]
[Route("api/messages")]
public class MessageController(IMessageService messageService): ControllerBase
{
    [HttpPost]
    [Authorize(Roles = $"{RoleNames.Member},{RoleNames.Staff}")]
    public async Task<IActionResult> Create([FromBody] MessageCreateRequest request)
    {
        var accessToken = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

        var result = await messageService.CreateMessageAsync(request,accessToken);
        return Ok(result);
    }

    [HttpGet("conversation/{conversationId}")]
    public async Task<IActionResult> GetMessagesByConversation(Guid conversationId)
    {
        var result = await messageService.GetMessagesByConversationIdAsync(conversationId);
        return Ok(result);
    }
}