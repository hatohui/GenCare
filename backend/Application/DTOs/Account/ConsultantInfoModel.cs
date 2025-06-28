using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Account;
public class ConsultantInfoModel
{
    public string Id { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool Gender { get; set; }
    public string? PhoneNumber { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? AvatarUrl { get; set; }
    public string Degree { get; set; } = null!;
    public int YearOfExperience { get; set; }
    public string? Biography { get; set; }
    public string Department { get; set; } = null!;
}
