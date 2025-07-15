using Application.DTOs.Statistic.Models;
using Application.DTOs.Statistic.Response;
using Application.Repositories;
using Application.Services;
using Domain.Common.Constants;

namespace Infrastructure.Services;
public class StatisticService(IPaymentHistoryRepository paymentHistoryRepository,
     IAccountRepository accountRepository,
     IServiceRepository serviceRepository,
     IResultRepository resultRepository,
     IOrderDetailRepository orderDetailRepository,
     IFeedbackRepository feedbackRepository) : IStatisticService
{
    public async Task<AdminStatisticResponse> GetAdminStatistic()
    {
        var dashboardStatistic = await GetDashboardStatistic();
        var revenueData = await GetDailyRevenueAsync();
        var userGrowth = await GetDailyUserGrowth();
        var serviceStatistic = await GetServiceStatistic();
        var paymentStatistic = await GetPaymentStatistic();
        var userStatistic = await GetUserStatistic();
        return new AdminStatisticResponse
        {
            DashboardStatistic = dashboardStatistic,
            RevenueData = revenueData,
            UserGrowth = userGrowth,
            TopServices = serviceStatistic,
            PaymentStatistic = paymentStatistic,
            UserStatistic = userStatistic
        };
    }
    public async Task<List<RevenueDataModel>> GetPeriodRevenueAsync()
    {
        var paymentHistories = await paymentHistoryRepository.GetAll();
        List<RevenueDataModel> response = new();
        response = paymentHistories
                .GroupBy(p => new { p.CreatedAt.Year, p.CreatedAt.Month })
                .Select(g => new RevenueDataModel
                {
                    //mỗi nhóm có 1 thuộc tính key (key này chứa các trường mà bạn đã dùng để nhóm)
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
    private async Task<List<UserGrowthModel>> GetDailyUserGrowth()
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
    private async Task<List<UserGrowthModel>> GetMonthlyUserGrowth()
    {
        var accounts = await accountRepository.GetAll();
        List<UserGrowthModel> response = new();
        response = accounts
                .GroupBy(a => new { a.CreatedAt.Year, a.CreatedAt.Month })
                .Select(g => new UserGrowthModel
                {
                    Date = new DateOnly(g.Key.Year, g.Key.Month, 1),
                    NewUsers = g.Count(a => !a.IsDeleted && a.Role.Name == RoleNames.Member)
                })
                .OrderByDescending(r => r.Date)
                .ToList();
        return response;
    }
    private async Task<List<TopServiceModel>> GetServiceStatistic()
    {
        var services = await serviceRepository.GetAll();
        var paymentHistories = await paymentHistoryRepository.GetAll();
        var orderDetails = await orderDetailRepository.GetAll();
        var feedbacks = await feedbackRepository.GetAll();
        var rs = new List<TopServiceModel>();


        services = services.Where(s => !s.IsDeleted).ToList();
        foreach (var service in services)
        {
            double? rating = null;
            int bookings = 0;
            decimal totalRevenue = 0;
            //get total bookings for each service
            //compute the total revenue for each service
            var tmpOrderDetails = orderDetails
                .Where(od => od.ServiceId == service.Id)
                .ToList();
            //check if purchaseId of each tmpOrderDetails exist in payment histories
            foreach (var orderDetail in tmpOrderDetails)
            {
                var payment = paymentHistoryRepository.GetById(orderDetail.PurchaseId);
                if(payment is not null)
                {
                    bookings += 1;
                    totalRevenue += service.Price;
                }
            }
            //compute average rating for each service
            
            var tmpFeedbacks = feedbacks
                .Where(f => f.ServiceId == service.Id)
                .ToList();
            if(tmpFeedbacks.Count > 0)
            {
                rating = tmpFeedbacks.Average(f => f.Rating);
            }

            rs.Add(new TopServiceModel()
            {
                ServiceId = service.Id.ToString(),
                ServiceName = service.Name,
                Bookings = bookings,
                Revenue = totalRevenue,
                Rating = rating
            });
        }
        
        return rs;
    }
    private async Task<PaymentStatisticModel> GetPaymentStatistic()
    {
        var paymentHistories = await paymentHistoryRepository.GetAll();
        var total = paymentHistories.Count;
        var pending = paymentHistories.Count(p => p.Status == PaymentStatus.Pending);
        var completed = paymentHistories.Count(p => p.Status == PaymentStatus.Paid);
        var failed = paymentHistories.Count(p => p.Status == PaymentStatus.Failed);
        var monthlyRevenue = await GetPeriodRevenueAsync();
        return new PaymentStatisticModel
        {
            Total = total,
            Pending = pending,
            Completed = completed,
            Failed = failed,
            MonthlyRevenue = monthlyRevenue
        };
    }
    private async Task<UserStatisticModel> GetUserStatistic()
    {
        var accounts = await accountRepository.GetAll();
        var totalUsers = accounts.Count(a => a.Role.Name == RoleNames.Member);
        var activeUsers = accounts.Count(a => !a.IsDeleted && a.Role.Name == RoleNames.Member);
        var monthlyUserGrowth = await GetMonthlyUserGrowth();
        return new UserStatisticModel
        {
            Total = totalUsers,
            Active = activeUsers,
            MonthlyGrowth = monthlyUserGrowth
        };
    }
}
