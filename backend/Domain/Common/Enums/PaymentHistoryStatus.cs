using NpgsqlTypes;

namespace Domain.Common.Enums;

public enum PaymentHistoryStatus
{
    [PgName("pending")] Pending,
    [PgName("paid")] Paid,
    [PgName("expired")] Expired
}