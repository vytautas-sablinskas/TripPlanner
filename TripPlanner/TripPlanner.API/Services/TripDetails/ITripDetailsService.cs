using TripPlanner.API.Dtos.TripDetails;

namespace TripPlanner.API.Services.TripDetails;

public interface ITripDetailsService
{
    void CreateTripDetail(CreateTripDetailDto tripDto, string userId);

    Task EditTripDetail(EditTripDetailDto tripDto);

    Task<TripDetailsDto> GetTripDetails(Guid tripId);

    GetEditTripDetailsDto GetTripDetailById(Guid tripId, Guid detailId);
}