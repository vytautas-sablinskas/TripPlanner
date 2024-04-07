using TripPlanner.API.Dtos.TripDetails;

namespace TripPlanner.API.Services.TripDetails;

public interface ITripDetailsService
{
    void CreateTripDetail(CreateTripDetailDto tripDto, string userId);

    Task EditTripDetail(EditTripDetailDto tripDto);

    Task DeleteTripDetail(Guid id);

    Task<TripDetailsDto> GetTripDetails(Guid tripId);

    GetEditTripDetailsDto GetTripDetailById(Guid tripId, Guid detailId);

    Task<(bool, TripDetailViewDto)> GetTripDetailView(Guid detailId);
}