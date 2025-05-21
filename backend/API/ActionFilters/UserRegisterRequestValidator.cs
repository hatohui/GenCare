using Application.DTOs.Auth.Request;
using FluentValidation;

namespace API.ActionFilters;

public class UserRegisterRequestValidator : AbstractValidator<UserRegisterRequest>
{
    public UserRegisterRequestValidator()
    {
        RuleFor(x => x.PhoneNumber)
             .NotEmpty().WithMessage("Phone number is required.")
             .Matches(@"^(0|\+84)\d{9}$").WithMessage("Invalid phone number format. Must be a valid Vietnamese number.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters.")
            .Matches(@"^(?=.*[A-Za-z])(?=.*\d).+$")
            .WithMessage("Password must contain at least one letter and one number.");

        RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().When(x => !string.IsNullOrWhiteSpace(x.Email)).WithMessage("Email must not be empty.")
            .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.Email)).WithMessage("Invalid email format.");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required.")
            .MaximumLength(70).WithMessage("Full name is too long.")
            .Must(name => !string.IsNullOrWhiteSpace(name?.Trim()))
            .WithMessage("Full name must not be only whitespace.");

        RuleFor(x => x.DateOfBirth)
            .LessThan(DateOnly.FromDateTime(DateTime.Today))
            .When(x => x.DateOfBirth.HasValue)
            .WithMessage("Date of birth must be in the past.");

        RuleFor(x => x.Address)
            .MaximumLength(255).WithMessage("Address is too long.")
            .When(x => !string.IsNullOrWhiteSpace(x.Address));
    }
}