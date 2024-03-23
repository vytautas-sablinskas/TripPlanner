using TripPlanner.API.Services.TripTravellers;

namespace TripPlanner.API.Dtos.TripTravellers;

public record TravellerInvitationDto (
    IEnumerable<string> Invites,
    string Message,
    TripPermissions Permissions
); 