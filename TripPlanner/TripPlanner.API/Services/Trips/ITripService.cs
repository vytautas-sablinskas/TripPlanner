using TripPlanner.API.Dtos.Trips;

namespace TripPlanner.API.Services.Trips;

public interface ITripService
{
    Task<Guid> CreateNewTrip(CreateTripDto tripDto, string userId);

    Task EditTrip(EditTripDto tripDto, Guid tripId);

    Task DeleteTrip(Guid tripId);

    TripDto GetTrip(Guid tripId);

    Task<TripShareInformationDto> GetTripShareInformation(Guid tripId, string userId);

    TripTimeDto GetTripTime(Guid tripId);

    Task<TripsDto> GetUserTrips(string userId, TripFilter filter, int page);

    Task<bool> UpdateShareTripInformation(string userId, Guid tripId, UpdateTripShareInformationDto dto);

    Task<string?> UpdateTripShareInformationLink(Guid tripId, string userId);

    Task<TripShareInformationViewDto> GetShareTripViewInformation(Guid linkId);
}