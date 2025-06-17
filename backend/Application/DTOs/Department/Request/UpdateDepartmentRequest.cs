namespace Application.DTOs.Department.Request;

public class UpdateDepartmentRequest
{
    public Guid DepartmentId { get; set; }
    public string? Name { get; set; } 
    public string? Description { get; set; }
}