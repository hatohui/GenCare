namespace Application.DTOs.Purchase.Request;

    public record class BookingServiceRequest
    {
        public List<OrderDetailRequest> OrderDetails { get; set; } = null!;
    }



