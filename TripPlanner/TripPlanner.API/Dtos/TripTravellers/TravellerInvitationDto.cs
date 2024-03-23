namespace TripPlanner.API.Dtos.TripTravellers;

public record TravellerInvitationDto (
    Guid TripId,
    string Email,
    string Message
);