using TripPlanner.API.Services.TripTravellers;

namespace TripPlanner.API.Dtos.TripTravellers;

public record UpdateTravellerInfoDto (
  TripPermissions Permissions
);