using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Statistic.Models;
public class PaymentStatisticModel
{
    public int Total { get; set; }
    public int Pending { get; set; }
    public int Completed { get; set; }
    public int Failed { get; set; }
    public List<RevenueDataModel> MonthlyRevenue { get; set; } = null!;
}
