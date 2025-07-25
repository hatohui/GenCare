﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Account;
public class StaffInfoViewModel
{
    public string Degree { get; set; } = null!;
    public int YearOfExperience { get; set; }
    public string? Biography { get; set; }
    public string DepartmentId { get; set; } = null!;
    public string DepartmentName { get; set; } = null!;
}
