using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Account;
public class StaffInfoCreateModel
{
    public string Degree { get; set; } = null!;
    public int YearOfExperience { get; set; }
    public string? Biography { get; set; }
    public string DepartmentId { get; set; } = null!;
}
