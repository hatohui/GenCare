using Application.DTOs.Conversation.Request;
using Application.DTOs.Conversation.Response;
using Application.Repositories;
using Application.Services;
using Domain.Entities;

namespace Infrastructure.Services;

public class ConversationService(IConversationRepository conversationRepository) : IConversationService
{
    private static DateTime ToUnspecified(DateTime dt)
    {
        return DateTime.SpecifyKind(dt, DateTimeKind.Unspecified);
    }
    public async Task<CreateConversationResponse> CreateConversationAsync(CreateConversationRequest request)
    {
        var conversation = new Conversation
        {
            Id = Guid.NewGuid(),
            MemberId = request.MemberId,
            StaffId = request.StaffId,
            Status = false,
            StartAt = ToUnspecified(DateTime.Now),
        };

        await conversationRepository.AddAsync(conversation);
        return new CreateConversationResponse()
        {
            Success = true,
            Message = "Conversation created successfully."
        };
    }

    public async Task<ViewConversationResponse> ViewConversationAsync(ViewConversationRequest request)
    {
        var conversation = await conversationRepository.GetByIdAsync(request.ConversationId);
       

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

        conversation.Status = false;
        return await conversationRepository.UpdateAsync(conversation);
        
    }

    public async Task<EditConversationResponse> EditConversationAsync(EditConversationRequest request)
    {
        var conversation = await conversationRepository.GetByIdAsync(request.ConversationId);
        if (conversation == null)
            return new EditConversationResponse { Success = false, Message = "Conversation not found." };

        conversation.StaffId = request.StaffId;
        conversation.MemberId = request.MemberId;
        conversation.Status = request.Status;

        if (request.StartAt.HasValue && ToUnspecified(request.StartAt.Value) >= ToUnspecified(DateTime.Now))
            conversation.StartAt = ToUnspecified(request.StartAt.Value);

        return await conversationRepository.UpdateAsync(conversation)
            ? new EditConversationResponse { Success = true, Message = "Conversation updated successfully." }
            : new EditConversationResponse { Success = false, Message = "Failed to update conversation." };
    }

    public async Task<List<Conversation>> GetPendingConversationsAsync() => await conversationRepository.GetPendingConversationsAsync();
    
}