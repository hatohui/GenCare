using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Auth.Responses;
public record class BookingServiceResponse
{
    public Guid PurchaseId { get; set; }
}
