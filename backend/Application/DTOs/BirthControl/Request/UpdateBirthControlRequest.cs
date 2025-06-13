namespace Application.DTOs.BirthControl.Request;

public class UpdateBirthControlRequest
{
    public Guid AccountId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}