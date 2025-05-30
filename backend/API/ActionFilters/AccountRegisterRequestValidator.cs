using Application.DTOs.Auth.Requests;
using FluentValidation;

namespace API.ActionFilters;

public class AccountRegisterRequestValidator : AbstractValidator<UserRegisterRequest>
{
    public AccountRegisterRequestValidator()
    {
        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters.")
            .Matches(@"^(?=.*[A-Za-z])(?=.*\d).+$")
            .WithMessage("Password must contain at least one letter and one number.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required.")
            .MaximumLength(30).WithMessage("First name is too long.")
            .Must(name => !string.IsNullOrWhiteSpace(name?.Trim()))
            .WithMessage("First name must not be only whitespace.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required.")
            .MaximumLength(30).WithMessage("Last name is too long.")
            .Must(name => !string.IsNullOrWhiteSpace(name?.Trim()))
            .WithMessage("Last name must not be only whitespace.");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required.")
            .Matches(@"^\+?\d{8,15}$").WithMessage("Invalid phone number format.")
            .MaximumLength(20).WithMessage("Phone number is too long.");

        RuleFor(x => x.DateOfBirth)
            .LessThan(DateOnly.FromDateTime(DateTime.Today))
            .When(x => x.DateOfBirth.HasValue)
            .WithMessage("Date of birth must be in the past.");
    }
}