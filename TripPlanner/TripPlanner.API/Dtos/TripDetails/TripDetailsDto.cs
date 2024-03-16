using TripPlanner.API.Dtos.Trips;

namespace TripPlanner.API.Dtos.TripDetails;

public record TripDetailsDto (
    IEnumerable<TripDetailDto> TripDetails,
    TripDto TripInformation
);