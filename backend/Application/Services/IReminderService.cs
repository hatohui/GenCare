namespace Application.Services;
public interface IReminderService
{
    /// <summary>
    /// Sends reminder emails to users who have placed orders more than 3 days ago but have not completed payment.
    /// </summary>
    /// <remarks>
    /// This method queries for unpaid purchases older than 3 days (using <see cref="IReminderRepository"/>).
    /// For each qualifying purchase, it sends a reminder email to the user's email address via <see cref="IEmailService"/>.
    /// </remarks>
    /// <returns>
    /// An asynchronous task that completes when all reminder emails have been sent.
    /// </returns>
    /// <example>
    /// await reminderService.SendUnpaidPurchaseRemindersAsync();
    /// </example>
    Task SendUnpaidPurchaseRemindersAsync();
    /// <summary>  
    /// Sends reminder emails to members and staff for appointments scheduled today.  
    /// </summary>  
    /// <remarks>  
    /// This method queries for today's appointments (using <see cref="IReminderRepository"/>).  
    /// For each appointment, it sends reminder emails to both the member and staff via <see cref="IEmailService"/>.  
    /// </remarks>  
    /// <returns>  
    /// An asynchronous task that completes when all reminder emails have been sent.  
    /// </returns>  
    Task SendTodayAppointmentRemindersAsync();
}