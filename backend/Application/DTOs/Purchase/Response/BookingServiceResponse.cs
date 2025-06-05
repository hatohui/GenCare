using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Purchase.Response;
public record class BookingServiceResponse
{
    //public Guid PurchaseId { get; set; }
    public string? message { get; set; }
}
