﻿using Application.DTOs.Role;

namespace Application.DTOs.Account;


public class AccountViewModel
{
    public Guid Id { get; set; }
    public RoleViewModel? Role { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public bool Gender { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? AvatarUrl { get; set; }
    public bool? IsDeleted { get; set; }
    public string? Phone { get; set; }
    public StaffInfoViewModel? StaffInfo { get; set; }    
}