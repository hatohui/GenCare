
namespace Application.DTOs.Statistic.Models;
public class DashboardStatisticModel
{
    public int TotalActiveUsers { get; set; }
    public int TotalActiveManagers { get; set; }
    public int TotalActiveStaffs { get; set; }
    public int TotalServices { get; set; }
    public decimal TotalRevenue { get; set; }
    public int TotalBookings { get; set; }
    public int TotalActiveConsultants { get; set; }
    public int PendingPayments { get; set; }
    public int CompletedPayments { get; set; }
    public int TestResults { get; set; }
}
