using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Purchase.Request;

    public record class BookingServiceRequest
    {
        public List<OrderDetailRequest> OrderDetails { get; set; }
    }

    public class OrderDetailRequest
    {
        public Guid ServiceId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public bool Gender { get; set; }
    }



