using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Services.TripTravellers;

namespace TripPlanner.API.Database.Entities;

public class Traveller
{
    public Guid Id { get; set; }

    public TripPermissions Permissions { get; set; }

    public TravellerStatus Status { get; set; }

    [DeleteBehavior(DeleteBehavior.Restrict)]
    public virtual AppUser User { get; set; }

    public string UserId { get; set; }
}