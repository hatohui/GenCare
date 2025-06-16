using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Schedule.Request;
public class ScheduleUpdateRequest
{
    public string ScheduleId { get; set; } = null!;
    public string? SlotId { get; set; }
    public string? AccountId { get; set; }
}
