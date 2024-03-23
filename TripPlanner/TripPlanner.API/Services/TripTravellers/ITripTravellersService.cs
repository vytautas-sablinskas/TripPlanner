using TripPlanner.API.Dtos.TripTravellers;

namespace TripPlanner.API.Services.TripTravellers;

public interface ITripTravellersService
{
    TravellersDto GetTravellers(Guid tripId, string userId);

    Task InviteTripTraveller(Guid tripId, TravellerInvitationDto invitationDto, string userId);

    void JoinTrip();

    Task RemoveTravellerFromTrip(Guid tripId, string userToDeleteEmail);
}