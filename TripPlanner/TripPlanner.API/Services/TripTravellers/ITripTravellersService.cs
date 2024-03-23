using TripPlanner.API.Dtos.TripTravellers;

namespace TripPlanner.API.Services.TripTravellers;

public interface ITripTravellersService
{
    TravellersDto GetTravellers(Guid tripId, string userId);

    void InviteTripTraveller();

    void JoinTrip();

    void RemoveFromTrip();
}