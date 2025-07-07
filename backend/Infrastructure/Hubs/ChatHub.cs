using Application.Helpers;
using Domain.Common.Constants;
using Domain.Exceptions;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.HUbs;

public class ChatHub : Hub
{
    public async Task SendMessageToConversation(Guid conversationId, object messageDto)
    {
        await Clients.Group(conversationId.ToString()).SendAsync("ReceiveMessage", messageDto);
    }

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
    public async Task JoinAsAvailableStaffOrConsultant()
    {
        var httpContext = Context.GetHttpContext();

        var token = httpContext?.Request.Query["access_token"].ToString();

        if (string.IsNullOrEmpty(token))
            throw new AppException(401, "Missing or invalid access token.");

        var role = JwtHelper.GetRoleFromToken(token);

        if (role != RoleNames.Staff && role != RoleNames.Consultant)
            throw new AppException(403, "You are not allowed to join this group.");

        await Groups.AddToGroupAsync(Context.ConnectionId, "AvailableStaffOrConsultant");
        await Clients.Caller.SendAsync("JoinedGroup", "AvailableStaffOrConsultant");
    }

    public async Task JoinConversation(string conversationId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
        await Clients.Caller.SendAsync("JoinedConversation", conversationId);
    }


}