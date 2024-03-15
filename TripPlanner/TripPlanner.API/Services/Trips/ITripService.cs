using TripPlanner.API.Dtos.Trips;

namespace TripPlanner.API.Services.Trips;

public interface ITripService
{
    Task<Guid> CreateNewTrip(CreateTripDto tripDto, IFormFile image, string userId);

    Task<TripsDto> GetUserTrips(string userId, TripFilter filter, int page);
}