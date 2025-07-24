using Application.DTOs.Conversation.Request;
using Application.DTOs.Conversation.Response;
using Application.Helpers;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[ApiController]
[Route("api/conversations")]
public class ConversationController(IConversationService conversationService): ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] InitConversationWithMessage request)
    {
        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        var response = await conversationService.InitConversationWithMessageAsync(request, token);
        return Ok(response);
    }
    [HttpGet]
    public async Task<IActionResult> ViewAllConversations()
    {
        ViewAllConversationResponse response = await conversationService.ViewAllConversationAsync();
        return Ok(response);
    }
   

    [HttpPost("{id}")]
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
    
    [HttpPut("{id}")]
    [Authorize(Roles = $"{RoleNames.Admin},{RoleNames.Staff}")]
    public async Task<IActionResult> EditConversation([FromBody] EditConversationRequest request,[FromRoute]Guid id)
    {
        var response = await conversationService.EditConversationAsync(request, id);
        if (response.Success)
            return Ok(response);
        return BadRequest(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> ViewConversation([FromRoute] Guid conversationId)
    {
        var response = await conversationService.ViewConversationAsync(conversationId);
        if (response.ConversationId != Guid.Empty)
            return Ok(response);
        return NotFound(new { Message = "Conversation not found." });
    }
    [HttpPost("assign/{conversationId}")]
    public async Task<IActionResult> AssignStaffToConversation(Guid conversationId)
    {
        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        var staffId = JwtHelper.GetAccountIdFromToken(token);

        var result = await conversationService.AssignStaffToConversationAsync(conversationId, staffId);
        if (!result)
            return BadRequest("Unable to assign staff. The conversation may have already been assigned.");

        return Ok(new { Success = true, Message = "Staff assigned successfully." });

    }


}