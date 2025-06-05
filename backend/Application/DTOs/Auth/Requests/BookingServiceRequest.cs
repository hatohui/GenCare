using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Auth.Requests;
public record class BookingServiceRequest
{
    public string? AccessToken { get; set; }
    public List<Guid>? ServiceIds { get; set; }
}
