using Application.DTOs.Message.Request;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;
[ApiController]
[Route("api/messages")]


public class MessageController(IMessageService messageService): ControllerBase
{
    
   
    /// <summary>
    /// Controller for handling message-related API endpoints.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = $"{RoleNames.Member},{RoleNames.Staff}")]
    public async Task<IActionResult> Create([FromBody] MessageCreateRequest request)
    {
        var accessToken = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

        var result = await messageService.CreateMessageAsync(request,accessToken);
        return Ok(result);
    }
    /// <summary>
    /// Retrieves all messages for a specific conversation.
    /// </summary>
    /// <param name="conversationId">The unique identifier of the conversation.</param>
    /// <returns>A list of messages in the specified conversation.</returns>
    [HttpGet("conversation/{conversationId}")]
    public async Task<IActionResult> GetMessagesByConversation(Guid conversationId)
    {
        var result = await messageService.GetMessagesByConversationIdAsync(conversationId);
        return Ok(result);
    }
    
    [HttpDelete("{messageId}")]
    [Authorize(Roles = $"{RoleNames.Member},{RoleNames.Staff}")]
    public async Task<IActionResult> DeleteMessage(Guid messageId)
    {
        var accessToken = Request.Headers.Authorization.ToString().Replace("Bearer ", "");
        await messageService.DeleteMessageAsync(messageId, accessToken);
        return Ok(new
        {
            success = true,
            message = "Message deleted successfully."
        });
    }
}