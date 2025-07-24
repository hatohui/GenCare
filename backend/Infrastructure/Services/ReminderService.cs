using Application.Repositories;
using Application.Services;

namespace Infrastructure.Services;
public class ReminderService(IReminderRepository reminderRepository, IEmailService emailService) : IReminderService
{

    public async Task SendUnpaidPurchaseRemindersAsync()
    {
        var purchases = await reminderRepository.GetUnpaidPurchasesOverDaysAsync(3, DateTime.Now);
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

    public async Task SendTodayAppointmentRemindersAsync()
    {
        var appointments = await reminderRepository.GetAppointmentsOfTodayAsync();

        foreach (var appointment in appointments)
        {
            if (appointment.Member == null || string.IsNullOrWhiteSpace(appointment.Member?.Email))
            {
                Console.WriteLine($"SKIP: Member null hoặc email không hợp lệ cho AppointmentId={appointment.Id} - MemberId={appointment.MemberId}");
                continue;
            }
            if (appointment.Staff == null || string.IsNullOrWhiteSpace(appointment.Staff?.Email))
            {
                Console.WriteLine($"SKIP: Staff null hoặc email không hợp lệ cho AppointmentId={appointment.Id} - StaffId={appointment.StaffId}");
                continue;
            }
            Console.WriteLine($"Member: {appointment.Member?.Email}, Staff: {appointment.Staff?.Email}");
            // Gửi cho thành viên
            var subjectMember = "Nhắc nhở cuộc hẹn hôm nay";
            var bodyMember = $@"
            Xin chào {appointment.Member.FirstName} {appointment.Member.LastName},<br/>
            Bạn có một cuộc hẹn với {appointment.Staff.FirstName} {appointment.Staff.LastName} vào lúc {appointment.ScheduleAt:dd/MM/yyyy HH:mm}.<br/>
            Vui lòng chuẩn bị và tham gia đúng giờ qua liên kết: <a href=""{appointment.JoinUrl}"">{appointment.JoinUrl}</a>.<br/>
            Nếu bạn cần thay đổi lịch hẹn, vui lòng liên hệ với chúng tôi.<br/>
            Trân trọng!";

            // Gửi cho nhân viên (staff)
            var subjectStaff = "Thông báo lịch hẹn bạn cần thực hiện hôm nay";
            var bodyStaff = $@"
            Xin chào {appointment.Staff.FirstName} {appointment.Staff.LastName},<br/>
            Bạn có một cuộc hẹn với {appointment.Member.FirstName} {appointment.Member.LastName} vào lúc {appointment.ScheduleAt:dd/MM/yyyy HH:mm}.<br/>
            Vui lòng chuẩn bị tham gia và hỗ trợ khách hàng đúng giờ qua liên kết: <a href=""{appointment.JoinUrl}"">{appointment.JoinUrl}</a>.<br/>
            Trân trọng!";

            // Chạy song song 2 email gửi cho member & staff
            var sendTasks = new List<Task>
            {
                emailService.SendEmailAsync(appointment.Member.Email, subjectMember, bodyMember),
                emailService.SendEmailAsync(appointment.Staff.Email, subjectStaff, bodyStaff)
            };
            await Task.WhenAll(sendTasks);
        }
    }
}