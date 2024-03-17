using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Database.Entities;

namespace TripPlanner.API.Database.DataAccess;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public DbSet<Trip> Trips { get; set; }

    public DbSet<TripDetail> TripDetails { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TripDetail>()
            .HasOne(td => td.Creator)
            .WithMany()
            .HasForeignKey(td => td.CreatorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Trip>()
            .HasMany(t => t.TripDetails)
            .WithOne(t => t.Trip)
            .HasForeignKey(t => t.TripId)
            .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(modelBuilder);
    }
}