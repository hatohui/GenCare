namespace Application.DTOs.Result;

public class TestItemResult
{
    public double Value { get; set; }
    public string Unit { get; set; } = default!;
    public string ReferenceRange { get; set; } = default!;
    public string Flag { get; set; } = default!;
}