using TripPlanner.API.Dtos.TripBudgets;
using TripPlanner.API.Dtos.Trips;

namespace TripPlanner.API.Dtos.TripDetails;

public record TripDetailsDto (
    IEnumerable<TripDetailMinimalDto> TripDetails,
    TripDto TripInformation,
    IEnumerable<TripBudgetMinimalDto> budgets
);