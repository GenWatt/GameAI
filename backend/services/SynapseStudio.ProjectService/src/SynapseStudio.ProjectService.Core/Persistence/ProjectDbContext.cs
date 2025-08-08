using Microsoft.EntityFrameworkCore;
using SynapseStudio.ProjectService.Domain.Entities;

namespace SynapseStudio.ProjectService.Core.Persistence;

public sealed class ProjectDbContext : DbContext
{
    public ProjectDbContext(DbContextOptions<ProjectDbContext> options) : base(options) { }

    public DbSet<Project> Projects => Set<Project>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var e = modelBuilder.Entity<Project>();

        e.ToTable("projects");
        e.HasKey(x => x.Id);
        e.Property(x => x.Name).HasMaxLength(200).IsRequired();
        e.HasIndex(x => x.Name).IsUnique();
        e.Property(x => x.Description).HasMaxLength(2000).IsRequired();
        e.Property(x => x.ImageUrl).HasMaxLength(1024);
        e.Property(x => x.CreatedAt).IsRequired();
        e.Property(x => x.UpdatedAt).IsRequired();
        e.Property(x => x.Type).HasConversion<string>().HasMaxLength(50).IsRequired();
    }
}
