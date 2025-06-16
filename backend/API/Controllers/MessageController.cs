using Application.DTOs.Message.Request;
using Application.Services;

namespace API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class MessageController(IMessageService messageService): ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] MessageCreateRequest request)
    {
        var result = await messageService.CreateMessageAsync(request);
        return Ok(result);
    }

    [HttpGet("conversation/{conversationId}")]
    public async Task<IActionResult> GetMessagesByConversation(Guid conversationId)
    {
        var result = await messageService.GetMessagesByConversationIdAsync(conversationId);
        return Ok(result);
    }
}