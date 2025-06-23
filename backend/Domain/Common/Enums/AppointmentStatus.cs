using NpgsqlTypes;

namespace Domain.Common.Enums;

public enum AppointmentStatus
{
    [PgName("booked")]
    Booked,
    [PgName("cancelled")]
    Cancelled,
    [PgName("completed")]
    Completed
}