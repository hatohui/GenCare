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
}