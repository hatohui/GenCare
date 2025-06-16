using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Feedback;
public class FeedbackUpdateRequest
{
    public string? Detail { get; set; }
    public int? Rating { get; set; }
}
