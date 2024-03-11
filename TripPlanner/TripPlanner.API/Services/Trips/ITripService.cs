using TripPlanner.API.Dtos.Trips;

namespace TripPlanner.API.Services.Trips;

public interface ITripService
{
    Guid CreateNewTrip(CreateTripDto tripDto, string userId);

    Task<TripsDto> GetUserTrips(string userId, TripFilter filter, int page);
}