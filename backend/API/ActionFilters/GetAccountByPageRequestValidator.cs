using Application.DTOs.Account.Requests;
using FluentValidation;

namespace API.ActionFilters;

public class GetAccountByPageRequestValidator : AbstractValidator<GetAccountByPageRequest>
{
    public GetAccountByPageRequestValidator()
    {
        RuleFor(x => x.Page)
             .GreaterThan(0)
             .WithMessage("Page index must be greater than or equal to 0.");

        RuleFor(x => x.Count)
            .GreaterThan(0)
            .WithMessage("Count must be greater than 0.");

        RuleFor(x => x.Search)
            .MaximumLength(100).WithMessage("Search term cannot exceed 100 characters.");

        RuleFor(x => x.Role)
            .Matches("^[a-zA-Z0-9._-]+$").WithMessage("Role must be alphanumeric.")
            .When(x => !string.IsNullOrEmpty(x.Role));

        RuleFor(x => x.Active)
            .NotNull()
            .WithMessage("Active must be provided (true or false).");
    }
}