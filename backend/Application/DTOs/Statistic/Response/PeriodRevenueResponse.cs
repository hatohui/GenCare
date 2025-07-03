using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Statistic.Models;

namespace Application.DTOs.Statistic.Response;
public class PeriodRevenueResponse
{
    public List<RevenueDataModel> RevenueDataModels { get; set; } = null!;
}
