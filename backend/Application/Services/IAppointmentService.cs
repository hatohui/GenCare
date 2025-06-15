using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Appointment.Request;
using Application.DTOs.Appointment.Response;

namespace Application.Services
{
    /// <summary>
    /// Provides appointment-related service operations.
    /// </summary>
    public interface IAppointmentService
    {
        /// <summary>
        /// Creates a new appointment.
        /// </summary>
        /// <param name="request">The appointment creation request.</param>
        /// <param name="accessId">The identifier of the user creating the appointment.</param>
        /// <returns>A task representing the asynchronous create operation.</returns>
        Task CreateAppointmentAsync(AppointmentCreateRequest request, string accessId);

        /// <summary>
        /// Retrieves all appointments.
        /// </summary>
        /// <returns>A list of all appointment view responses.</returns>
        Task<List<AllAppointmentViewResponse>> ViewAllAppointmentsAsync();

        /// <summary>
        /// Updates an existing appointment.
        /// </summary>
        /// <param name="request">The appointment update request.</param>
        /// <param name="appointmentId">The unique identifier of the appointment to update.</param>
        /// <param name="updateId">The identifier of the user performing the update.</param>
        /// <returns>A task representing the asynchronous update operation.</returns>
        Task UpdateAppointmentAsync(AppointmentUpdateRequest request, string appointmentId, string updateId);

        /// <summary>
        /// Deletes an appointment.
        /// </summary>
        /// <param name="appointmentId">The unique identifier of the appointment to delete.</param>
        /// <param name="deleteId">The identifier of the user performing the delete operation.</param>
        /// <returns>A task representing the asynchronous delete operation.</returns>
        Task DeleteAppointmentAsync(string appointmentId, string deleteId);
    }
}