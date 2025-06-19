using Application.DTOs.Slot.Model;

namespace Application.DTOs.Slot.Response;

public class ViewAllSlotResponse
{
    public List<ViewSlotForManager> Slots { get; set; }
    
}