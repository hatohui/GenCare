using Application.Helpers;
using Domain.Common.Constants;
using Domain.Exceptions;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.HUbs;

public class ChatHub : Hub
{
    /// <summary>
    /// Sends a message to all clients in the specified conversation group.
    /// </summary>
    /// <param name="conversationId">The ID of the conversation group.</param>
    /// <param name="messageDto">The message object to send.</param>
    public async Task SendMessageToConversation(Guid conversationId, object messageDto)
    {
        await Clients.Group(conversationId.ToString()).SendAsync("ReceiveMessage", messageDto);
    }

    /// <summary>
    /// Ping method for connection health checks
    /// </summary>
    public async Task Ping()
    {
        await Clients.Caller.SendAsync("Pong");
    }

    /// <summary>
    /// Executed when a new client connects to the hub.
    /// Automatically adds them to the conversation group if the conversation ID is provided in the query string.
    /// </summary>
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var conversationId = httpContext?.Request.Query["conversationId"];
        if (!string.IsNullOrEmpty(conversationId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId!);
        }

        await base.OnConnectedAsync();
    }

    /// <summary>
    /// Allows a staff or consultant (authenticated via JWT) to join the group
    /// that receives real-time notifications for new conversations.
    /// </summary>
    /// <exception cref="AppException">Thrown when the token is missing or the role is not authorized.</exception>
    public async Task JoinAsAvailableStaffOrConsultant()
    {
        var httpContext = Context.GetHttpContext();
        var token = AuthHelper.GetAccessToken(httpContext);

        if (string.IsNullOrEmpty(token))
            throw new AppException(401, "Missing or invalid access token.");

        var role = JwtHelper.GetRoleFromToken(token);

        if (role != RoleNames.Staff && role != RoleNames.Consultant)
            throw new AppException(403, "You are not allowed to join this group.");

        await Groups.AddToGroupAsync(Context.ConnectionId, "AvailableStaffOrConsultant");
        await Clients.Caller.SendAsync("JoinedGroup", "AvailableStaffOrConsultant");
    }

    /// <summary>
    /// Adds the current connection to a conversation group.
    /// </summary>
    /// <param name="conversationId">The ID of the conversation group to join.</param>
    public async Task JoinConversation(string conversationId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
        await Clients.Caller.SendAsync("JoinedConversation", conversationId);

        // Notify other clients in the conversation that a consultant has joined
        await Clients
            .GroupExcept(conversationId, Context.ConnectionId)
            .SendAsync("ConsultantJoined", new { conversationId });
    }
}
