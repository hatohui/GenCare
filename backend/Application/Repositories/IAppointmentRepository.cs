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
    }
}