using TripPlanner.API.Services.TripTravellers;

namespace TripPlanner.API.Dtos.TripTravellers;

public class TravellerDto 
{
    public Guid Id { get; set; }

    public string FullName { get; set; }
    
    public string Email { get; set; }

    public TravellerStatus Status { get; set; }
    
    public TripPermissions Permissions { get; set; }
}