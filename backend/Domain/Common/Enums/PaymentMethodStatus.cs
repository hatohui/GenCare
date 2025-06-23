using NpgsqlTypes;

namespace Domain.Common.Enums;

public enum PaymentMethodStatus
{
    [PgName("card")] Card,
    [PgName("momo")] Momo,
    [PgName("bank")] Bank
}