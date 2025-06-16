using Application.DTOs.Message.Request;
using Application.DTOs.Message.Response;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Infrastructure.HUbs;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.Services;

public class MessageService(IMessageRepository messageRepository, 
                            IMediaRepository mediaRepository,  
                            IHubContext<ChatHub> chatHub) : IMessageService
{
    private static DateTime ToUnspecified(DateTime dt)
    {
        return DateTime.SpecifyKind(dt, DateTimeKind.Unspecified);
    }
    public async Task<MessageResponse> CreateMessageAsync(MessageCreateRequest request,string accessToken)
    {
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken);

        //create message
        var newMessage = new Message()
        {
            Id = Guid.NewGuid(),
            Content = request.Content,
            ConversationId = request.ConversationId,
            CreatedAt = ToUnspecified(DateTime.Now),
            CreatedBy = accountId,
            UpdatedBy = accountId,
        };

        //handle media files
        var mediaList = new List<Media>();
        if (request.MediaUrls != null && request.MediaUrls.Any())
        {
            foreach (var url in request.MediaUrls)
            {
                // add media to the list
                mediaList.Add(new Media
                {
                    Id = Guid.NewGuid(),
                    Url = url,
                    Type = "Image",
                    MessageId = newMessage.Id,
                });
            }
        }


        newMessage.Media = mediaList;

        //save message and media
        await messageRepository.AddAsync(newMessage);
        await mediaRepository.AddListOfMediaAsync(mediaList);

        // Broadcast qua SignalR
        await chatHub.Clients.Group(request.ConversationId.ToString())
            .SendAsync("ReceiveMessage", new
            {
                messageId = newMessage.Id,
                content = newMessage.Content,
                createdBy = newMessage.CreatedBy,
                createdAt = newMessage.CreatedAt,
                media = mediaList.Select(m => new { m.Url, m.Type })
            });

        // Response trả về
        return new MessageResponse
        {
            Id = newMessage.Id,
            Content = newMessage.Content,
            CreatedAt = newMessage.CreatedAt,
            CreatedBy = newMessage.CreatedBy,
            MediaUrls = mediaList.Select(m => m.Url).ToList()
        };
    }    

    public async Task<List<MessageResponse>> GetMessagesByConversationIdAsync(Guid conversationId)
    {
        var messages = await messageRepository.GetAllByConversationIdAsync(conversationId);

        return messages.Select(m => new MessageResponse
        {
            Id = m.Id,
            Content = m.Content,
            CreatedAt = m.CreatedAt,
            CreatedBy = m.CreatedBy,
            MediaUrls = m.Media?.Select(x => x.Url).ToList() ?? new()
        }).ToList();    
    }
   

}