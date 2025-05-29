using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Domain.Abstractions;

public interface IApplicationDbContext
{
    public DbSet<Account> Accounts { get; set; }

    public DbSet<Appointment> Appointments { get; set; }

    public DbSet<BirthControl> BirthControls { get; set; }

    public DbSet<Blog> Blogs { get; set; }

    public DbSet<BlogTag> BlogTags { get; set; }

    public DbSet<Comment> Comments { get; set; }

    public DbSet<Conversation> Conversations { get; set; }

    public DbSet<Department> Departments { get; set; }

    public DbSet<Feedback> Feedbacks { get; set; }

    public DbSet<Message> Messages { get; set; }

    public DbSet<OrderDetail> OrderDetails { get; set; }

    public DbSet<PaymentHistory> PaymentHistories { get; set; }

    public DbSet<Purchase> Purchases { get; set; }

    public DbSet<RefreshToken> RefreshTokens { get; set; }

    public DbSet<Result> Results { get; set; }

    public DbSet<Role> Roles { get; set; }

    public DbSet<Schedule> Schedules { get; set; }

    public DbSet<Service> Services { get; set; }

    public DbSet<Slot> Slots { get; set; }

    public DbSet<StaffInfo> StaffInfos { get; set; }

    public DbSet<Tag> Tags { get; set; }

    Task<int> SaveChangesAsync();
}