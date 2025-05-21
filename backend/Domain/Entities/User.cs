using Domain.Common.Enums;

namespace Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Admin;
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
}
