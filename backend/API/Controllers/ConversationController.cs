using Application.DTOs.Conversation.Request;
using Application.Services;

namespace API.Controllers;

[ApiController]
[Route("api/[conversation]")]
public class ConversationController(IConversationService conversationService): ControllerBase
{
    [HttpPost]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateConversationRequest request)
    {
        var result = await conversationService.CreateConversationAsync(request);
        return result is null ? BadRequest("Failed to create") : Ok(result);
    }

    [HttpPost("join")]
    public async Task<IActionResult> Join([FromBody] JoinConversationRequest request)
    {
        var result = await conversationService.JoinConversationAsync(request);
        return result ? Ok("Joined successfully") : BadRequest("Join failed");
    }

    [HttpPost("{id}/end")]
    public async Task<IActionResult> End(Guid id)
    {
        var result = await conversationService.EndConversationAsync(id);
        return result ? Ok("Conversation ended") : NotFound();
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        var conversations = await conversationService.GetPendingConversationsAsync();
        return Ok(conversations);
    }
}