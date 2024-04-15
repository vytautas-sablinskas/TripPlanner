using TripPlanner.API.Dtos.TripDetails;

namespace TripPlanner.API.Dtos.Trips;
public record TripShareInformationViewDto(
    IEnumerable<TripDetailMinimalDto> TripDetails,
    TripDto TripInformation,
    TripShareInformationDto sharedInformation,
    string UserDisplayName
);