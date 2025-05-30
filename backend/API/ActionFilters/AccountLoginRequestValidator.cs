using Application.DTOs.Auth.Requests;
using FluentValidation;

namespace API.ActionFilters;

public class AccountLoginRequestValidator : AbstractValidator<UserLoginRequest>
{
    public AccountLoginRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters.")
            .Matches(@"^(?=.*[A-Za-z])(?=.*\d).+$")
            .WithMessage("Password must contain at least one letter and one number.");
    }
}