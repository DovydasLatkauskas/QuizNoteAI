using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApiTemplate.Models;

namespace WebApiTemplate;

public class AppDbContext : IdentityDbContext<User> {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {

    }

    public DbSet<Group> Groups { get; set; }
    public DbSet<Subgroup> Subgroups { get; set; }
    public DbSet<ContentFile> ContentFiles { get; set; }
    public DbSet<Quiz> Quizzes { get; set; }
    public DbSet<Question> Questions { get; set; }

    protected override void OnModelCreating(ModelBuilder builder) {
        base.OnModelCreating(builder);

        builder.Entity<Question>()
            .Property(q => q.Answers)
            .HasColumnType("jsonb");
    }
}