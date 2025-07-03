using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Statistic.Models;
using Application.DTOs.Statistic.Response;
using Application.Repositories;
using Application.Services;
using Domain.Common.Constants;

namespace Infrastructure.Services;
public class StatisticService(IPaymentHistoryRepository paymentHistoryRepository,
     IAccountRepository accountRepository,
     IServiceRepository serviceRepository,
     IResultRepository resultRepository) : IStatisticService
{
    public async Task<AdminStatisticResponse> GetAdminStatistic()
    {
        var dashboardStatistic = await GetDashboardStatistic();
        var revenueData = await GetDailyRevenueAsync();
        var userGrowth = await GetUserGrowth();
    }

    public async Task<List<RevenueDataModel>> GetPeriodRevenueAsync()
    {
        var paymentHistories = await paymentHistoryRepository.GetAll();
        List<RevenueDataModel> response = new();
        response = paymentHistories
                .GroupBy(p => new { p.CreatedAt.Year, p.CreatedAt.Month })
                .Select(g => new RevenueDataModel
                {
                    Date = new DateOnly(g.Key.Year, g.Key.Month, 1),
                    Revenue = g.Sum(p => p.Amount),
                    Bookings = g.Count() //đếm số lượng phần tử trong mỗi nhóm
                                        //mà bạn đã nhóm lại
                })
                .OrderByDescending(r => r.Date)
                .ToList();
        return response;
    }
 
    private async Task<DashboardStatisticModel> GetDashboardStatistic()
    {
        //dashboard statistic 
        var accounts = await accountRepository.GetAll();
        //active users
        var activeUsers = accounts.Count(a => !a.IsDeleted && a.Role.Name == RoleNames.Member);
        //active manager
        var activeManagers = accounts.Count(a => !a.IsDeleted && a.Role.Name == RoleNames.Manager);
        //active staff
        var activeStaff = accounts.Count(a => !a.IsDeleted && a.Role.Name == RoleNames.Staff);
        //active consultant
        var activeConsultants = accounts.Count(a => !a.IsDeleted && a.Role.Name == RoleNames.Consultant);
        //total service
        var totalServices = await serviceRepository.GetAll();
        totalServices = totalServices.Where(s => !s.IsDeleted).ToList();
        //total revenue
        var paymentHistories = await paymentHistoryRepository.GetAll();
        var totalRevenue = paymentHistories.Sum(p => p.Amount);
        //total bookings
        var totalBookings = paymentHistories.Count;
        //total pending payments
        var totalPendingPayments = paymentHistories.Count(p => p.Status == PaymentStatus.Pending);
        //total completed payments
        var totalCompletedPayments = paymentHistories.Count(p => p.Status == PaymentStatus.Paid);
        //total result
        var totalResults = await resultRepository.ViewResultListAsync();

        return new DashboardStatisticModel
        {
            TotalActiveUsers = activeUsers,
            TotalActiveManagers = activeManagers,
            TotalActiveStaffs = activeStaff,
            TotalActiveConsultants = activeConsultants,
            TotalServices = totalServices.Count,
            TotalRevenue = totalRevenue,
            TotalBookings = totalBookings,
            PendingPayments = totalPendingPayments,
            CompletedPayments = totalCompletedPayments,
            TestResults = totalResults.Count
        };
    }
    private async Task<List<RevenueDataModel>> GetDailyRevenueAsync()
    {
        var paymentHistories = await paymentHistoryRepository.GetAll();
        List<RevenueDataModel> response = new();
        response = paymentHistories
                .GroupBy(p => new { p.CreatedAt.Year, p.CreatedAt.Month, p.CreatedAt.Day })
                .Select(g => new RevenueDataModel
                {
                    Date = new DateOnly(g.Key.Year, g.Key.Month, g.Key.Day),
                    Revenue = g.Sum(p => p.Amount),
                    Bookings = g.Count() //đếm số lượng phần tử trong mỗi nhóm
                                         //mà bạn đã nhóm lại
                })
                .OrderByDescending(r => r.Date)
                .ToList();
        return response;
    }
    private async Task<List<UserGrowthModel>> GetUserGrowth()
    {
        var accounts = await accountRepository.GetAll();
        List<UserGrowthModel> response = new();
        response = accounts
                .GroupBy(a => new { a.CreatedAt.Year, a.CreatedAt.Month, a.CreatedAt.Day })
                .Select(g => new UserGrowthModel
                {
                    Date = new DateOnly(g.Key.Year, g.Key.Month, g.Key.Day),
                    NewUsers = g.Count(a => !a.IsDeleted && a.Role.Name == RoleNames.Member)
                })
                .OrderByDescending(r => r.Date)
                .ToList();
        return response;
    }
}
