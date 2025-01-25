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

        builder.Entity<Group>()
            .HasOne(g => g.User)
            .WithMany(u => u.Groups)
            .HasForeignKey(g => g.UserId)
            .IsRequired();

        builder.Entity<ContentFile>()
            .HasOne(cf => cf.Group)
            .WithMany(g => g.ContentFiles)
            .HasForeignKey(cf => cf.GroupId);

        builder.Entity<ContentFile>()
            .HasOne(cf => cf.Subgroup)
            .WithMany(sg => sg.ContentFiles)
            .HasForeignKey(cf => cf.SubgroupId);
    }
}