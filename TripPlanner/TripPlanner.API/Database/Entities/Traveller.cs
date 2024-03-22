using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Database.Enums;
using TripPlanner.API.Services.TripTravellers;

namespace TripPlanner.API.Database.Entities;

public class Traveller
{
    public Guid Id { get; set; }

    public TripPermissions Permission { get; set; }

    [DeleteBehavior(DeleteBehavior.Restrict)]
    public AppUser User { get; set; }

    public string UserId { get; set; }
}