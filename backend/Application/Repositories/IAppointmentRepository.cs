using Domain.Entities;

namespace Application.Repositories
{
    /// <summary>
    /// Provides data access methods for appointment entities.
    /// </summary>
    public interface IAppointmentRepository
    {
        /// <summary>
        /// Retrieves all appointments.
        /// </summary>
        /// <returns>A list of all appointments.</returns>
        Task<List<Appointment>> GetAll();

        /// <summary>
        /// Retrieves an appointment by its unique identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the appointment.</param>
        /// <returns>The appointment if found; otherwise, null.</returns>
        Task<Appointment?> GetById(string id);

        /// <summary>
        /// Adds a new appointment to the data store.
        /// </summary>
        /// <param name="a">The appointment entity to add.</param>
        /// <returns>A task that represents the asynchronous add operation.</returns>
        Task Add(Appointment a);

        /// <summary>
        /// Deletes an appointment from the data store.
        /// </summary>
        /// <param name="a">The appointment entity to delete.</param>
        /// <returns>A task that represents the asynchronous delete operation.</returns>
        Task Delete(Appointment a);

        /// <summary>
        /// Updates an existing appointment in the data store.
        /// </summary>
        /// <param name="a">The appointment entity with updated information.</param>
        /// <returns>A task that represents the asynchronous update operation.</returns>
        Task Update(Appointment a);

        /// <summary>
        /// Lấy danh sách các cuộc hẹn của một staff trong một khoảng thời gian nhất định,
        /// dùng để kiểm tra trùng lịch.
        /// </summary>
        /// <param name="staffId">Id của staff.</param>
        /// <param name="from">Thời gian bắt đầu của khoảng kiểm tra.</param>
        /// <param name="to">Thời gian kết thúc của khoảng kiểm tra.</param>
        /// <returns>Danh sách cuộc hẹn bị trùng với khoảng thời gian yêu cầu.</returns>
        Task<List<Appointment>> GetOverlappedAppointmentsForStaff(Guid staffId, DateTime start);

    }
}