using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Purchase.Response;
public class BookedService
{
    public string OrderDetailId { get; set; } = null!;
    public string PurchaseId { get; set; } = null!;
    public string ServiceName { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public DateOnly DateOfBirth { get; set; }
    public bool Gender { get; set; }
    public DateTime CreatedAt { get; set; }
}
