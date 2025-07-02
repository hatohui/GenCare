using Application.DTOs.Appointment.Request;
using Application.DTOs.Appointment.Response;
using Application.Repositories;
using Application.Services;
using Domain.Common.Constants;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;

public class AppointmentService(IAccountRepository accountRepository,
    IAppointmentRepository appointmentRepository) : IAppointmentService
{
    public async Task CreateAppointmentAsync(AppointmentCreateRequest request, string accessId)
    {
        //find member by id
        var member = await accountRepository.GetAccountByIdAsync(Guid.Parse(request.MemberId));
        //find staff by id
        var staff = await accountRepository.GetAccountByIdAsync(Guid.Parse(request.StaffId));
        //create appointment
        Appointment appointment = new()
        {
            Member = member ?? throw new AppException(404, "member id is invalid"),
            Staff = staff ?? throw new AppException(404, "staff id is invalid"),
            ScheduleAt = DateTime.SpecifyKind(request.ScheduleAt, DateTimeKind.Unspecified),
            CreatedBy = Guid.Parse(accessId),
            Status = AppointmentStatus.Booked,
        };
        //save appointment
        await appointmentRepository.Add(appointment);
    }

    public async Task DeleteAppointmentAsync(string appointmentId, string deleteId)
    {
        //get appointment by id
        var appointment = await appointmentRepository.GetById(appointmentId);
        if (appointment == null)
        {
            throw new AppException(404, "Appointment not found");
        }
        //mark as deleted
        appointment.IsDeleted = true;
        appointment.DeletedAt = DateTime.Now;
        appointment.DeletedBy = Guid.Parse(deleteId);

        await appointmentRepository.Update(appointment);
    }

    public async Task UpdateAppointmentAsync(AppointmentUpdateRequest request, string appointmentId, string updateId)
    {
        //get appointment by id
        var appointment = await appointmentRepository.GetById(appointmentId);
        if (appointment == null)
        {
            throw new AppException(404, "Appointment not found");
        }
        //edit
        if (request.MemberId != null)
        {
            var member = await accountRepository.GetAccountByIdAsync(Guid.Parse(request.MemberId));
            appointment.Member = member ?? throw new AppException(404, "member id is invalid");
        }
        if (request.StaffId != null)
        {
            var staff = await accountRepository.GetAccountByIdAsync(Guid.Parse(request.StaffId));
            appointment.Staff = staff ?? throw new AppException(404, "staff id is invalid");
        }
        if (request.ScheduleAt != null) appointment.ScheduleAt = DateTime.SpecifyKind(request.ScheduleAt.Value, DateTimeKind.Unspecified);
        if (request.JoinUrl != null) appointment.JoinUrl = request.JoinUrl;
        appointment.UpdatedAt = DateTime.Now;
        appointment.UpdatedBy = Guid.Parse(updateId);
        //update appointment
        await appointmentRepository.Update(appointment);
    }

    public async Task<List<AllAppointmentViewResponse>> ViewAllAppointmentsAsync(string accountId)
    {
        //get account by id
        var account = await accountRepository.GetAccountByIdAsync(Guid.Parse(accountId));
        if (account == null)
        {
            throw new AppException(404, "Account not found");
        }
        //check authorization
        bool isLow = false;
        string role = account.Role!.Name.ToLower();
        if (role == RoleNames.Member.ToLower() || role == RoleNames.Staff.ToLower())
            isLow = true;
        //create response
        var list = await appointmentRepository.GetAll();
        List<AllAppointmentViewResponse> rs = new();
        foreach (var appointment in list)
        {
            rs.Add(new AllAppointmentViewResponse
            {
                Id = appointment.Id.ToString("D"),
                MemberId = appointment.Member.Id.ToString("D"),
                MemberName = $"{appointment.Member.FirstName} {appointment.Member.LastName}",
                StaffId = appointment.Staff.Id.ToString("D"),
                StaffName = $"{appointment.Staff.FirstName} {appointment.Staff.LastName}",
                ScheduleAt = appointment.ScheduleAt,
                JoinUrl = appointment.JoinUrl,
                IsDeleted = appointment.IsDeleted,
                Status = appointment.Status
            });
        }
        //if account is member or staff, filter appointments
        if (isLow)
        {
            rs = rs.Where(a => a.MemberId == account.Id.ToString("D") || a.StaffId == account.Id.ToString("D")).ToList();
        }
        return rs;
    }

    public async Task<AppointmentViewResponse> ViewAppointmentByIdAsync(string appointmentId, string accountId)
    {
        //get account by id
        var account = await accountRepository.GetAccountByIdAsync(Guid.Parse(accountId));
        if(account == null)
        {
            throw new AppException(404, "Account not found");
        }
        //check authorization
        bool isLow = false;
        string role = account.Role!.Name.ToLower();
        if (role == RoleNames.Member.ToLower() || role == RoleNames.Staff.ToLower())
            isLow = true;
        //get appointment by id
        var appointment = await appointmentRepository.GetById(appointmentId);
        if(appointment == null)
        {
            throw new AppException(404, "Appoinment not found");
        }
        //create response
        var response = new AppointmentViewResponse() {
            MemberId = appointment.Member.Id.ToString("D"),
            MemberName = $"{appointment.Member.FirstName} {appointment.Member.LastName}",
            StaffId = appointment.Staff.Id.ToString("D"),
            StaffName = $"{appointment.Staff.FirstName} {appointment.Staff.LastName}",
            ScheduleAt = appointment.ScheduleAt,
            JoinUrl = appointment.JoinUrl,
            IsDeleted = appointment.IsDeleted,
            Status = appointment.Status
        };

        //if account is member or staff, check if appointment is for them
        if (isLow)
        {
            if (appointment.Member.Id != account.Id && appointment.Staff.Id != account.Id)
            {
                throw new AppException(403, "You are not authorized to view this appointment");
            }
            else
            {
                return response;
            }
        }
        return response;
    }
}