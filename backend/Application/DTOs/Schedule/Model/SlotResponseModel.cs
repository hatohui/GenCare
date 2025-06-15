using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Schedule.Model;
public class SlotResponseModel
{
    public int No { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
}
