﻿namespace Application.DTOs.Department.Response;

public class DepartmentGetResponse
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
}