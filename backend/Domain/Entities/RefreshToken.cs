namespace Domain.Entities;

public class RefreshToken
{
    public Guid Id { get; set; }

    public Guid AccountId { get; set; }

    public string Token { get; set; } = null!;

    public bool IsRevoked { get; set; }

    public DateTime? LastUsedAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    public virtual Account Account { get; set; } = null!;
}