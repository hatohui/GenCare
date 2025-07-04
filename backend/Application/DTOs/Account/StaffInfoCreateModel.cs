﻿namespace Application.DTOs.Account;

public class StaffInfoCreateModel
{
    public string Degree { get; set; } = null!;
    public int YearOfExperience { get; set; }
    public string? Biography { get; set; }
    public string DepartmentId { get; set; } = null!;
}