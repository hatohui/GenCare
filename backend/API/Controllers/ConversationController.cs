using Application.DTOs.Conversation.Request;
using Application.DTOs.Conversation.Response;
using Application.Helpers;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[ApiController]
[Route("api/conversation")]
public class ConversationController(IConversationService conversationService): ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateConversationRequest request)
    {
        var result = await conversationService.CreateConversationAsync(request);
        return Ok(result);        
    }
    [HttpGet("all")]
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
    
    [HttpPut("edit")]
    [Authorize(Roles = $"{RoleNames.Admin},{RoleNames.Staff}")]
    public async Task<IActionResult> EditConversation([FromBody] EditConversationRequest request)
    {
        var response = await conversationService.EditConversationAsync(request);
        if (response.Success)
            return Ok(response);
        return BadRequest(response);
    }

    [HttpGet("view")]
    public async Task<IActionResult> ViewConversation([FromQuery] ViewConversationRequest request)
    {
        var response = await conversationService.ViewConversationAsync(request);
        if (response.ConversationId != Guid.Empty)
            return Ok(response);
        return NotFound(new { Message = "Conversation not found." });
    }
    [HttpPost("join")]
    [Authorize(Roles = $"{RoleNames.Staff},{RoleNames.Consultant}")]
    public async Task<IActionResult> JoinConversation([FromBody] JoinConversationRequest request)
    {
        Guid staffId = JwtHelper.GetAccountIdFromToken(Request.Headers["Authorization"]);


        var success = await conversationService.AssignStaffToConversationAsync(request.ConversationId, staffId);
        return success ? Ok("Joined conversation.") : BadRequest(new { error = "Could not join." });

    }

}