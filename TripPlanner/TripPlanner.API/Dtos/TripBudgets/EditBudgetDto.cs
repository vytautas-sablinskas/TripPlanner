using TripPlanner.API.Database.Enums;
using TripPlanner.API.Dtos.TripBudgets;

public record EditBudgetDto(
    BudgetTypes Type,
    string Name,
    string? Description,
    string MainCurrency,
    double Budget,
    bool UnlimitedAmount,
    IEnumerable<TripBudgetMemberDto>? Members
);