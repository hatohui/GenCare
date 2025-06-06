﻿namespace Domain.Entities;

public class PaymentHistory
{
    public Guid PurchaseId { get; set; }

    public Guid TransactionId { get; set; }

    public DateTime CreatedAt { get; set; }

    public decimal Amount { get; set; }

    public DateTime? ExpiredAt { get; set; }

    public Purchase Purchase { get; set; } = null!;
}