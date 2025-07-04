using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Statistic.Models;
public class TopServiceModel
{
    public string ServiceId { get; set; } = null!;
    public string ServiceName { get; set; } = null!;
    public int Bookings { get; set; }
    public decimal Revenue { get; set; }
    public double? Rating { get; set; }
}
