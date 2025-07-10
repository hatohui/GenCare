using Application.DTOs.Blog.Request;
using FluentValidation;

namespace API.ActionFilters;
/// <summary>
/// Validates the parameters of a blog listing request to ensure they meet required criteria.
/// </summary>
/// <remarks>
/// This validator ensures:
/// - Page numbers start at 1
/// - Result count is between 1 and 100 to prevent excessive data requests
/// </remarks>
public class ListOfBlogRequestValidator : AbstractValidator<ListOfBlogRequest>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="ListOfBlogRequestValidator"/> class
    /// and configures the validation rules.
    /// </summary>
    public ListOfBlogRequestValidator()
    {
        RuleFor(x => x.Page)
            .Cascade(CascadeMode.Stop)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Page must be at least 1.");

        RuleFor(x => x.Count)
            .Cascade(CascadeMode.Stop)
            .InclusiveBetween(1, 100)
            .WithMessage("Count must be between 1 and 100.");
    }
}