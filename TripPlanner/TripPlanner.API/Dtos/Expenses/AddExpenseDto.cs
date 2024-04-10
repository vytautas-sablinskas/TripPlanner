using TripPlanner.API.Database.Enums;

namespace TripPlanner.API.Dtos.Expenses;

public record AddExpenseDto (
    string Currency,
    BudgetTypes Type,
    string Name,
    double Amount
);