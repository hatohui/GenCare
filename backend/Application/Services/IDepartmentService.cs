using Application.DTOs.Department.Response;

namespace Application.Services
{
    /// <summary>
    /// Provides department-related service operations.
    /// </summary>
    public interface IDepartmentService
    {
        /// <summary>
        /// Retrieves all departments.
        /// </summary>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains a list of <see cref="DepartmentGetResponse"/> objects.
        /// </returns>
        Task<List<DepartmentGetResponse>> GetAllDepartment();
    }
}