using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Statistic.Models;
using Application.DTOs.Statistic.Response;

namespace Application.Services;
public interface IStatisticService
{
    Task<List<RevenueDataModel>> GetPeriodRevenueAsync();
    Task<AdminStatisticResponse> GetAdminStatistic();
    Task<DashboardStatisticModel> GetDashboardStatistic();
    Task<List<RevenueDataModel>> GetDailyRevenueAsync();
    Task<List<UserGrowthModel>> GetDailyUserGrowth();
    Task<List<TopServiceModel>> GetServiceStatistic();
    Task<PaymentStatisticModel> GetPaymentStatistic();
    Task<UserStatisticModel> GetUserStatistic();
}
