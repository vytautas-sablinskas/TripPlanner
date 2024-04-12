using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Database.Entities;

namespace TripPlanner.API.Database.DataAccess;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public DbSet<Trip> Trips { get; set; }

    public DbSet<TripDetail> TripDetails { get; set; }

    public DbSet<Notification> NotificationDetails { get; set; }

    public DbSet<AppUser> AppUsers { get; set; }

    public DbSet<Traveller> Travellers { get; set; }

    public DbSet<TripBudget> TripBudgets { get; set; }

    public DbSet<TripBudgetMember> TripBudgetMembers { get; set; }

    public DbSet<TripDocument> TripDocuments { get; set; }

    public DbSet<Expense> Expenses { get; set; }

    public DbSet<CurrencyExchangeRate> CurrencyExchangeRates { get; set; }

    public DbSet<TripDocumentMember> TripDocumentMembers { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}