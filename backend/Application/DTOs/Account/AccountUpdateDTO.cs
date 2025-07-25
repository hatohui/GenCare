﻿namespace Application.DTOs.Account;

public class AccountUpdateDTO
{ 
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? RoleId { get; set; }
    public bool? Gender { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? AvatarUrl { get; set; }
    public bool? IsDeleted { get; set; }
}