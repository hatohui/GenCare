namespace Application.DTOs.Slot;

public class ViewSlotForManager
{
    public Guid Id { get; set; }
    public int No { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
    public bool IsDeleted { get; set; }
    public List<Domain.Entities.Account> Accounts { get; set; }
}