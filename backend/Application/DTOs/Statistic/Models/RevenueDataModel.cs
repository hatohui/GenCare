using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Statistic.Models;
public class RevenueDataModel
{
    public DateOnly Date { get; set; }
    public decimal Revenue { get; set; }
    public int Bookings { get; set; }
}
