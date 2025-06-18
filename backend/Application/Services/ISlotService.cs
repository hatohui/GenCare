using Application.DTOs.Slot;
using Application.DTOs.Slot.Request;
using Application.DTOs.Slot.Response;

namespace Application.Services;

public interface ISlotService
{
    Task<CreateSlotResponse> CreateSlot(CreateSlotRequest request);
    
    
}