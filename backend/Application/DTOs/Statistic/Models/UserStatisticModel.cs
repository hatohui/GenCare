using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Statistic.Models;
public class UserStatisticModel
{
    public int Total { get; set; }
    public int Active { get; set; }
    public List<UserGrowthModel> MonthlyGrowth { get; set; } = null!;
}
