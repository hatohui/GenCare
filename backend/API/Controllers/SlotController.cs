using Application.DTOs.Slot.Request;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;
[ApiController]
[Route("api/slots")]
public class SlotController(ISlotService slotService) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = $"{RoleNames.Admin},{RoleNames.Manager}")]
    public async Task<IActionResult> CreateSlot([FromBody] CreateSlotRequest request)
    {
        var response = await slotService.CreateSlot(request);
        return Ok(response);
    }

    // PUT: api/Slot
    [HttpPut]
    [Authorize(Roles = $"{RoleNames.Admin},{RoleNames.Manager}")]
    public async Task<IActionResult> UpdateSlot([FromBody] UpdateSlotRequest request)
    {
        var response = await slotService.UpdateSlot(request);
        return Ok(response);
    }

    // DELETE: api/Slot
    [HttpDelete("{id}")]
    [Authorize(Roles = $"{RoleNames.Admin},{RoleNames.Manager}")]
    public async Task<IActionResult> DeleteSlot([FromRoute]Guid id)
    {
       
    
        var response = await slotService.DeleteSlot(id);
        return Ok(response);
    }

    // GET: api/Slot/
    [HttpGet]
    public async Task<IActionResult> ViewAllSlot()
    {
        var response = await slotService.ViewAllSlot();
        return Ok(response);
    }
}