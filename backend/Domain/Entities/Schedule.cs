using System;
using System.Collections.Generic;

namespace Domain.Entities;

public   class Schedule
{
    public Guid Id { get; set; }

    public Guid SlotId { get; set; }

    public Guid AccountId { get; set; }

    public   Account Account { get; set; } = null!;

    public   Slot Slot { get; set; } = null!;
}
