using TripPlanner.API.Dtos.TripTravellers;

namespace TripPlanner.API.Services.TripTravellers
{
    public interface ITripTravellersService
    {
        IEnumerable<TravellerDto> GetTravellers(Guid tripId);
        void InviteTripTraveller();
        void JoinTrip();
        void RemoveFromTrip();
    }
}