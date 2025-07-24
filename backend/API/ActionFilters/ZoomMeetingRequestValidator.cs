using Application.DTOs.Appointment.Request;
using FluentValidation;
using Application.Helpers;

namespace API.ActionFilters;

public class AppointmentCreateRequestValidator : AbstractValidator<AppointmentCreateRequest>
{
    public AppointmentCreateRequestValidator()
    {
        RuleFor(x => x.MemberId)
        .NotEmpty().WithMessage("MemberId is required.");

        RuleFor(x => x.StaffId)
            .NotEmpty().WithMessage("StaffId is required.");

        RuleFor(x => x.ScheduleAt)
            .Must(BeInTheFuture)
            .WithMessage("ScheduleAt must be in the future.");
    }

    private static bool BeInTheFuture(DateTime startTime)
    {
        return startTime > DateTimeHelper.ToUtc7(DateTime.UtcNow);
    }
}
