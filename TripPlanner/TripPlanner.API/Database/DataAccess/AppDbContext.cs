﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
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
        base.OnModelCreating(modelBuilder);
    }
}