using TripPlanner.API.Dtos.TripDetails;

namespace TripPlanner.API.Services.TripDetails;

public interface ITripDetailsService
{
    void CreateTripDetail(CreateTripDetailDto tripDto, string userId);

    Task<TripDetailsDto> GetTripDetails(Guid tripId);
}