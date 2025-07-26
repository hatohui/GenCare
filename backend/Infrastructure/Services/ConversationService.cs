using Application.DTOs.Conversation.Request;
using Application.DTOs.Conversation.Response;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Infrastructure.HUbs;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.Services;

public class ConversationService(
    IConversationRepository conversationRepository,
    IHubContext<ChatHub> chatHub,
    IMessageRepository messageRepository,
    IMediaRepository mediaRepository,
    IAccountRepository accountRepository
) : IConversationService
{
    private static DateTime ToUnspecified(DateTime dt)
    {
        return DateTime.SpecifyKind(dt, DateTimeKind.Unspecified);
    }

    public async Task<CreateConversationResponse> CreateConversationAsync(
        CreateConversationRequest request
    )
    {
        var conversation = new Conversation
        {
            Id = Guid.NewGuid(),
            MemberId = request.MemberId,
            StaffId = null, // Initially no staff assigned
            Status = false,
            StartAt = ToUnspecified(DateTime.Now),
        };
        // Real-time notify to all available staff/consultants
        await chatHub
            .Clients.Group("AvailableStaffOrConsultant")
            .SendAsync(
                "NewConversationCreated",
                new
                {
                    conversationId = conversation.Id,
                    memberId = conversation.MemberId,
                    startAt = conversation.StartAt,
                    status = conversation.Status,
                }
            );

        await conversationRepository.AddAsync(conversation);
        return new CreateConversationResponse()
        {
            Success = true,
            Message = "Conversation created successfully.",
            ConversationId = conversation.Id,
        };
    }

    public async Task<ViewConversationResponse> ViewConversationAsync(Guid id)
    {
        var conversation = await conversationRepository.GetByIdAsync(id);

        if (conversation == null)
        {
            return new ViewConversationResponse
            {
                ConversationId = Guid.Empty,
                MemberId = Guid.Empty,
                StaffId = null,
                StartAt = null,
                Status = false,
            };
        }

        return new ViewConversationResponse
        {
            ConversationId = conversation.Id,
            MemberId = conversation.MemberId,
            StaffId = conversation.StaffId,
            StartAt = conversation.StartAt,
            Status = conversation.Status,
        };
    }

    public async Task<bool> EndConversationAsync(Guid conversationId)
    {
        var conversation = await conversationRepository.GetByIdAsync(conversationId);

        if (conversation == null)
        {
            return false;
        }

        conversation.Status = false;
        var result = await conversationRepository.UpdateAsync(conversation);

        // Notify all participants in the conversation that it has ended
        if (result)
        {
            await chatHub
                .Clients.Group(conversationId.ToString())
                .SendAsync("ConversationEnded", new { conversationId });
        }

        return result;
    }

    public async Task<ViewAllConversationResponse> ViewAllConversationAsync()
    {
        var conversations = await conversationRepository.GetAllAsync();
        return new ViewAllConversationResponse()
        {
            Conversations = conversations
                .Select(c => new ConversationPayLoad()
                {
                    ConversationId = c.Id,
                    MemberId = c.MemberId,
                    // StaffId = c.StaffId,
                    StartAt = c.StartAt,
                    Status = c.Status,
                })
                .ToList(),
        };
    }

    public async Task<EditConversationResponse> EditConversationAsync(
        EditConversationRequest request,
        Guid conversationId
    )
    {
        var conversation = await conversationRepository.GetByIdAsync(conversationId);
        if (conversation == null)
            return new EditConversationResponse
            {
                Success = false,
                Message = "Conversation not found.",
            };

        conversation.StaffId = request.StaffId;
        conversation.MemberId = request.MemberId;
        conversation.Status = request.Status;

        if (
            request.StartAt.HasValue
            && ToUnspecified(request.StartAt.Value) >= ToUnspecified(DateTime.Now)
        )
            conversation.StartAt = ToUnspecified(request.StartAt.Value);

        return await conversationRepository.UpdateAsync(conversation)
            ? new EditConversationResponse
            {
                Success = true,
                Message = "Conversation updated successfully.",
            }
            : new EditConversationResponse
            {
                Success = false,
                Message = "Failed to update conversation.",
            };
    }

    public async Task<PendingConversationsListResponse> GetPendingConversationsAsync()
    {
        var conversations = await conversationRepository.GetPendingConversationsAsync();
        var pendingConversations = new List<PendingConversationResponse>();

        foreach (var conversation in conversations)
        {
            string? memberName = null;
            string? memberAvatarUrl = null;
            string? memberFirstName = null;
            string? memberLastName = null;
            string? memberEmail = null;

            // Fetch member account information using MemberId (which is actually AccountId)
            var memberAccount = await accountRepository.GetAccountByIdAsync(conversation.MemberId);
            if (memberAccount != null)
            {
                memberFirstName = memberAccount.FirstName;
                memberLastName = memberAccount.LastName;
                memberEmail = memberAccount.Email;
                memberName = $"{memberAccount.FirstName} {memberAccount.LastName}".Trim();
                if (string.IsNullOrWhiteSpace(memberName))
                {
                    memberName = memberAccount.Email ?? "Patient";
                }
                memberAvatarUrl = memberAccount.AvatarUrl;
            }

            pendingConversations.Add(
                new PendingConversationResponse
                {
                    ConversationId = conversation.Id,
                    MemberId = conversation.MemberId,
                    MemberFirstName = memberFirstName,
                    MemberLastName = memberLastName,
                    MemberEmail = memberEmail,
                    MemberName = memberName,
                    MemberAvatarUrl = memberAvatarUrl,
                    StartAt = conversation.StartAt,
                    Status = conversation.Status,
                }
            );
        }

        return new PendingConversationsListResponse
        {
            Conversations = pendingConversations,
            TotalCount = pendingConversations.Count,
        };
    }

    public async Task<bool> AssignStaffToConversationAsync(Guid conversationId, Guid staffId)
    {
        var convo = await conversationRepository.GetByIdAsync(conversationId);
        if (convo is not { StaffId: null })
            return false;

        convo.StaffId = staffId;
        convo.Status = true;
        convo.StartAt = DateTime.Now;

        return await conversationRepository.UpdateAsync(convo);
    }

    public async Task<InitConversationResponse> InitConversationWithMessageAsync(
        InitConversationWithMessage request,
        string accessToken
    )
    {
        // Extract account ID from JWT access token
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken);

        // 1. Create a new conversation with the provided memberId
        var conversation = new Conversation
        {
            Id = Guid.NewGuid(),
            MemberId = request.MemberId,
            StaffId = null, // No staff assigned yet
            Status = false, // Conversation is not active yet
            StartAt = ToUnspecified(DateTime.Now),
        };

        // Save the new conversation to the database
        await conversationRepository.AddAsync(conversation);

        //Notify all available staff/consultants in real-time
        await chatHub
            .Clients.Group("AvailableStaffOrConsultant")
            .SendAsync(
                "NewConversationCreated",
                new
                {
                    conversationId = conversation.Id,
                    memberId = request.MemberId,
                    startAt = conversation.StartAt,
                    status = conversation.Status,
                }
            );

        // 3. Create the first message in the new conversation
        var newMessage = new Message
        {
            Id = Guid.NewGuid(),
            ConversationId = conversation.Id,
            Content = request!.FirstMessage, // Default content for the first message
            CreatedAt = ToUnspecified(DateTime.Now),
            CreatedBy = accountId,
            UpdatedBy = accountId,
        };

        // Prepare media files if any
        var mediaList = new List<Media>();
        if (request.MediaUrls != null && request.MediaUrls.Any())
        {
            foreach (var url in request.MediaUrls)
            {
                mediaList.Add(
                    new Media
                    {
                        Url = url,
                        Type = "Image", // Assuming image for now
                        MessageId = newMessage.Id,
                        CreatedBy = accountId,
                        CreatedAt = newMessage.CreatedAt,
                        UpdatedBy = accountId,
                    }
                );
            }
        }

        newMessage.Media = mediaList;

        // Save the message and related media files to the database
        await messageRepository.AddAsync(newMessage);
        await mediaRepository.AddListOfMediaAsync(mediaList);

        //  Broadcast the first message in real-time to the conversation group
        await chatHub
            .Clients.Group(conversation.Id.ToString())
            .SendAsync(
                "ReceiveMessage",
                new
                {
                    messageId = newMessage.Id,
                    content = newMessage.Content,
                    createdBy = newMessage.CreatedBy,
                    createdAt = newMessage.CreatedAt,
                    media = mediaList.Select(m => new { m.Url, m.Type }),
                }
            );

        //  Return a response with conversation and message information
        return new InitConversationResponse
        {
            ConversationId = conversation.Id,
            MessageId = newMessage.Id,
            Content = newMessage.Content,
            CreatedAt = newMessage.CreatedAt,
        };
    }

    public async Task<ViewAllConversationResponse> GetUserConversationHistoryAsync(Guid userId)
    {
        var conversations = await conversationRepository.GetConversationsByUserIdAsync(userId);
        var conversationPayloads = new List<ConversationPayLoad>();

        foreach (var conversation in conversations)
        {
            string? staffName = null;
            string? staffAvatarUrl = null;
            string? memberName = null;
            string? memberAvatarUrl = null;

            // Fetch staff account information using StaffId (which is actually AccountId)
            if (conversation.StaffId.HasValue)
            {
                var staffAccount = await accountRepository.GetAccountByIdAsync(
                    conversation.StaffId.Value
                );
                if (staffAccount != null)
                {
                    staffName = $"{staffAccount.FirstName} {staffAccount.LastName}".Trim();
                    if (string.IsNullOrWhiteSpace(staffName))
                    {
                        staffName = staffAccount.Email ?? "Healthcare Consultant";
                    }
                    staffAvatarUrl = staffAccount.AvatarUrl;
                }
            }

            // Fetch member account information using MemberId (which is actually AccountId)
            var memberAccount = await accountRepository.GetAccountByIdAsync(conversation.MemberId);
            if (memberAccount != null)
            {
                memberName = $"{memberAccount.FirstName} {memberAccount.LastName}".Trim();
                if (string.IsNullOrWhiteSpace(memberName))
                {
                    memberName = memberAccount.Email ?? "Patient";
                }
                memberAvatarUrl = memberAccount.AvatarUrl;
            }

            conversationPayloads.Add(
                new ConversationPayLoad()
                {
                    ConversationId = conversation.Id,
                    MemberId = conversation.MemberId,
                    StaffId = conversation.StaffId,
                    StaffName = staffName,
                    StaffAvatarUrl = staffAvatarUrl,
                    MemberName = memberName,
                    MemberAvatarUrl = memberAvatarUrl,
                    StartAt = conversation.StartAt,
                    Status = conversation.Status,
                }
            );
        }

        return new ViewAllConversationResponse() { Conversations = conversationPayloads };
    }

    public async Task<ViewAllConversationResponse> GetConsultantConversationHistoryAsync(
        Guid consultantId
    )
    {
        var conversations = await conversationRepository.GetConversationsByStaffIdAsync(
            consultantId
        );
        var conversationPayloads = new List<ConversationPayLoad>();

        foreach (var conversation in conversations)
        {
            string? memberName = null;
            string? memberAvatarUrl = null;

            // Fetch member account information using MemberId (which is actually AccountId)
            var memberAccount = await accountRepository.GetAccountByIdAsync(conversation.MemberId);
            if (memberAccount != null)
            {
                memberName = $"{memberAccount.FirstName} {memberAccount.LastName}".Trim();
                if (string.IsNullOrWhiteSpace(memberName))
                {
                    memberName = memberAccount.Email ?? "Patient";
                }
                memberAvatarUrl = memberAccount.AvatarUrl;
            }

            string? staffName = null;
            string? staffAvatarUrl = null;

            // Fetch staff account information using StaffId (which is actually AccountId)
            if (conversation.StaffId.HasValue)
            {
                var staffAccount = await accountRepository.GetAccountByIdAsync(
                    conversation.StaffId.Value
                );
                if (staffAccount != null)
                {
                    staffName = $"{staffAccount.FirstName} {staffAccount.LastName}".Trim();
                    if (string.IsNullOrWhiteSpace(staffName))
                    {
                        staffName = staffAccount.Email ?? "Healthcare Consultant";
                    }
                    staffAvatarUrl = staffAccount.AvatarUrl;
                }
            }

            conversationPayloads.Add(
                new ConversationPayLoad()
                {
                    ConversationId = conversation.Id,
                    MemberId = conversation.MemberId,
                    StaffId = conversation.StaffId,
                    MemberName = memberName,
                    MemberAvatarUrl = memberAvatarUrl,
                    StaffName = staffName,
                    StaffAvatarUrl = staffAvatarUrl,
                    StartAt = conversation.StartAt,
                    Status = conversation.Status,
                }
            );
        }

        return new ViewAllConversationResponse() { Conversations = conversationPayloads };
    }
}
