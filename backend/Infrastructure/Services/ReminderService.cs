using Application.Repositories;
using Application.Services;

namespace Infrastructure.Services;
public class ReminderService(IReminderRepository reminderRepository, IEmailService emailService) : IReminderService
{

    public async Task SendUnpaidPurchaseRemindersAsync()
    {
        var purchases = await reminderRepository.GetUnpaidPurchasesOverDaysAsync(3);
        foreach (var purchase in purchases)
        {
            var subject = "Nhắc nhở thanh toán đơn hàng";
            var body = $"Xin chào {purchase.FirstName ?? "bạn"},<br/>" +
                       $"Bạn đã đặt hàng vào {purchase.CreatedAt:dd/MM/yyyy} nhưng chưa thanh toán. " +
                       $"Vui lòng hoàn tất thanh toán để đảm bảo quyền lợi.<br/>" +
                       $"Nếu đã thanh toán, vui lòng bỏ qua email này.<br/>" +
                       $"Trân trọng!";
            await emailService.SendEmailAsync(purchase.Email, subject, body);
        }
    }
}