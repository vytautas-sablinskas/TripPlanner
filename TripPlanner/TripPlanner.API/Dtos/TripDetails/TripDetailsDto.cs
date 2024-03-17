using TripPlanner.API.Dtos.Trips;

namespace TripPlanner.API.Dtos.TripDetails;

public record TripDetailsDto (
    IEnumerable<TripDetailMinimalDto> TripDetails,
    TripDto TripInformation
);