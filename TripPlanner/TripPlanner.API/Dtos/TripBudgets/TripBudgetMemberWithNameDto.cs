namespace TripPlanner.API.Dtos.TripBudgets;

public record TripBudgetMemberWithNameDto(
    string Email,
    string FullName,
    double Amount
);