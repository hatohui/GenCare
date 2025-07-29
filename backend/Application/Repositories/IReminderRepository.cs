using Domain.Entities;

namespace Application.Repositories
{
    public interface IReminderRepository
    {
        /// <summary>
        /// Retrieves a list of unpaid purchases that have been created more than a specified number of days ago.
        /// </summary>
        /// <param name="days">
        /// The number of days to check; purchases created before the current time minus this value will be considered.
        /// </param>
        /// <param name="now">
        /// The current date and time to use as the reference point for calculations. This allows for testability and injection of the current time.
        /// </param>
        /// <returns>
        /// A task representing the asynchronous operation, containing a list of <see cref="UnpaidPurchaseInfo"/>
        /// for purchases older than the specified number of days with no successful payments.
        /// </returns>
        /// <remarks>
        /// This method performs a join between the Purchases and Accounts tables, and checks that there is 
        /// no associated payment in the PaymentHistories table with a status of "paid".
        /// </remarks>
        Task<List<UnpaidPurchaseInfo>> GetUnpaidPurchasesOverDaysAsync(int days, DateTime now);
        /// <summary>  
        /// Retrieves a list of appointments scheduled for today.  
        /// </summary>  
        /// <returns>  
        /// A task representing the asynchronous operation, containing a list of <see cref="Appointment"/>  
        /// entities scheduled for the current day, including related Member and Staff information.  
        /// </returns>  
        /// <remarks>  
        /// This method queries appointments where the ScheduleAt date falls within today's date range  
        /// and excludes soft-deleted appointments.  
        /// </remarks>  
        Task<List<Appointment>> GetAppointmentsOfTodayAsync();

    }

    public class UnpaidPurchaseInfo
    {
        public Guid PurchaseId { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
