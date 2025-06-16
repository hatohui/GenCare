namespace Application.DTOs.BirthControl.Response;

public class ViewBirthControlResponse
{
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public DateTime MenstrualStartDate { get; set; }
    public DateTime MenstrualEndDate { get; set; }

    public DateTime? StartSafeDate { get; set; }
    public DateTime? EndSafeDate { get; set; }

    public DateTime? SecondSafeStart { get; set; }
    public DateTime? SecondSafeEnd { get; set; }

    public DateTime StartUnsafeDate { get; set; }
    public DateTime EndUnsafeDate { get; set; }
}