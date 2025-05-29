using System;
using System.Collections.Generic;

namespace Domain.Entities;

public   class Result
{
    public Guid OrderDetailId { get; set; }

    public DateTime OrderDate { get; set; }

    public DateTime? SampleDate { get; set; }

    public DateTime? ResultDate { get; set; }

    public bool? Status { get; set; }

    public string? ResultData { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public   OrderDetail OrderDetail { get; set; } = null!;
}
