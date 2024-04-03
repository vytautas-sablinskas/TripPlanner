using TripPlanner.API.Database.Enums;

namespace TripPlanner.API.Dtos.TripBudgets;

public record AddTripBudgetDto (
    BudgetTypes Type,
    string Name,
    string? Description,
    string MainCurrency,
    double Budget,
    bool UnlimitedAmount,
    IEnumerable<TripBudgetMemberDto>? Members
);