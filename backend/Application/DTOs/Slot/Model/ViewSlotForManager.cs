namespace Application.DTOs.Slot.Model;

public class ViewSlotForManager
{
    public Guid Id { get; set; }
    public int No { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
    public bool IsDeleted { get; set; }
    public List<AccountInforView> Accounts { get; set; }
}