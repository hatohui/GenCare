using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Statistic.Models;
using Application.DTOs.Statistic.Response;
using Application.Repositories;
using Application.Services;

namespace Infrastructure.Services;
public class StatisticService(IPaymentHistoryRepository paymentHistoryRepository) : IStatisticService
{
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
                .OrderBy(r => r.Date)
                .ToList();
        return response;
    }
}
