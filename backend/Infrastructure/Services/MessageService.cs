using Application.DTOs.Message.Request;
using Application.DTOs.Message.Response;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Domain.Exceptions;
using Infrastructure.HUbs;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.Services;
/// <summary>
/// Service implementation for handling message-related operations,
/// including message creation, media handling, and retrieving messages by conversation.
/// </summary>
public class MessageService(IMessageRepository messageRepository, 
                            IMediaRepository mediaRepository,  
                            IHubContext<ChatHub> chatHub) : IMessageService
{
    /// <summary>
    /// Converts the specified <see cref="DateTime"/> to have an unspecified kind.
    /// </summary>
    /// <param name="dt">The date and time to convert.</param>
    /// <returns>A <see cref="DateTime"/> with <see cref="DateTimeKind.Unspecified"/>.</returns>
    private static DateTime ToUnspecified(DateTime dt)
    {
        return DateTime.SpecifyKind(dt, DateTimeKind.Unspecified);
    }
    
    /// <summary>
    /// Creates a new message, handles associated media, saves to the repository,
    /// and broadcasts the message to the conversation group via SignalR.
    /// </summary>
    /// <param name="request">The message creation request payload.</param>
    /// <param name="accessToken">The access token used to identify the account.</param>
    /// <returns>The created message as a <see cref="MessageResponse"/>.</returns>
    public async Task<MessageResponse> CreateMessageAsync(MessageCreateRequest request,string accessToken)
    {
        //get account id from access token
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken);
        if (!Guid.TryParse(request.ConversationId, out var conversationId))
            throw new AppException(400, "Invalid id format.");
        //create message
        var newMessage = new Message()
        {
            Id = Guid.NewGuid(),
            Content = request.Content,
            ConversationId = conversationId,
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
                    CreatedBy = accountId,
                    CreatedAt = ToUnspecified(DateTime.Now),
                    UpdatedBy = accountId,
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

        return new MessageResponse
        {
            Id = newMessage.Id,
            Content = newMessage.Content,
            CreatedAt = newMessage.CreatedAt,
            CreatedBy = newMessage.CreatedBy,
            MediaUrls = mediaList.Select(m => m.Url).ToList()
        };
    }    
    /// <summary>
    /// Retrieves all messages for a given conversation.
    /// </summary>
    /// <param name="conversationId">The unique identifier of the conversation.</param>
    /// <returns>A list of <see cref="MessageResponse"/> objects for the conversation.</returns>
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