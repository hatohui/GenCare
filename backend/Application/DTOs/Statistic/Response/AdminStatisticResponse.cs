using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Statistic.Models;

namespace Application.DTOs.Statistic.Response;
public class AdminStatisticResponse
{
    public DashboardStatisticModel DashboardStatistic { get; set; } = null!;
    public List<RevenueDataModel> RevenueData { get; set; } = null!;
    public List<UserGrowthModel> UserGrowth { get; set; } = null!;
    public List<TopServiceModel> TopServices { get; set; } = null!;
    public PaymentStatisticModel PaymentStatistic { get; set; } = null!;
    public UserStatisticModel UserStatistic { get; set; } = null!;
    //public List<ServicePerformanceModel> ServicePerformance { get; set; } = null!;
}
